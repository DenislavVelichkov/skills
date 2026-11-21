import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import {
  candidateSetSha256,
  changedCandidates,
  formatApprovalRequest,
  formatApprovalRequests,
  formatChangedCandidates,
  validateManifest,
} from "../skills/engineering/setup-matt-pocock-skills/validate-visual-acceptance.mjs";

const roots = [];
afterEach(() => {
  while (roots.length) rmSync(roots.pop(), { force: true, recursive: true });
});

const sha256 = (value) =>
  `sha256:${createHash("sha256").update(value).digest("hex")}`;

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "visual-acceptance-"));
  roots.push(root);
  const write = (path, contents) => {
    const absolute = join(root, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, contents);
    return sha256(contents);
  };
  const reference = {
    locale: "en",
    viewport: "1440x1000",
    scenario: "ready",
    path: "docs/visual-acceptance/redesign/references/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/references/overview.png",
      "reference",
    ),
  };
  return {
    root,
    write,
    surface: {
      id: "overview",
      route: "/overview",
      selection: "A",
      requiredRegions: ["summary", "activity"],
      requiredInteractions: ["keyboard-navigation"],
      state: "design_selected",
      references: [reference],
      candidates: [],
      comparison: null,
      deviations: [],
      approvalRequest: null,
      approval: null,
      baselines: [],
    },
  };
}

test("accepts a frozen design selection and reports separate progress", () => {
  const { root, surface } = fixture();
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.progress, {
    total: 1,
    implemented: 0,
    compared: 0,
    approvalRequested: 0,
    memberAccepted: 0,
    baselinePromoted: 0,
  });
});

test("accepts a truthful planning surface before references are selected", () => {
  const { root, surface } = fixture();
  surface.selection = "Pending design selection";
  surface.state = "planned";
  surface.references = [];

  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.progress, {
    total: 1,
    implemented: 0,
    compared: 0,
    approvalRequested: 0,
    memberAccepted: 0,
    baselinePromoted: 0,
  });
});

test("rejects acceptance that is not bound to the candidate set", () => {
  const { root, surface, write } = fixture();
  const candidate = {
    ...surface.references[0],
    path: "docs/visual-acceptance/redesign/candidates/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/candidates/overview.png",
      "candidate",
    ),
  };
  surface.state = "member_accepted";
  surface.candidates = [candidate];
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
    sha256: write(
      "docs/visual-acceptance/redesign/comparisons/overview.md",
      "comparison",
    ),
  };
  surface.approvalRequest = {
    requestedAt: "2026-08-09T11:59:00.000Z",
    source: "https://example.test/reviews/1#request",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  surface.approval = {
    approvedBy: "Product owner",
    approvedAt: "2026-08-09T12:00:00.000Z",
    source: "https://example.test/reviews/1",
    candidateSetSha256: `sha256:${"0".repeat(64)}`,
  };
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(result.errors.join("\n"), /candidateSetSha256/u);
});

test("accepts only promoted baselines that match the approved candidate", () => {
  const { root, surface, write } = fixture();
  const candidate = {
    ...surface.references[0],
    path: "docs/visual-acceptance/redesign/candidates/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/candidates/overview.png",
      "candidate",
    ),
  };
  const baseline = {
    ...candidate,
    path: "tests/screenshots/overview.png",
    sha256: write("tests/screenshots/overview.png", "candidate"),
  };
  surface.state = "baseline_promoted";
  surface.candidates = [candidate];
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
    sha256: write(
      "docs/visual-acceptance/redesign/comparisons/overview.md",
      "comparison",
    ),
  };
  surface.approvalRequest = {
    requestedAt: "2026-08-09T11:59:00.000Z",
    source: "https://example.test/reviews/1#request",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  surface.approval = {
    approvedBy: "Product owner",
    approvedAt: "2026-08-09T12:00:00.000Z",
    source: "https://example.test/reviews/1",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  surface.baselines = [baseline];
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { requireComplete: true, root },
  );
  assert.deepEqual(result.errors, []);
  assert.equal(result.progress.baselinePromoted, 1);
});

test("rejects evidence paths outside the repository", () => {
  const { root, surface } = fixture();
  surface.references[0].path = "../reference.png";
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(result.errors.join("\n"), /escapes the repository root/u);
});

test("rejects an evidence symlink whose target leaves the repository", () => {
  const { root, surface } = fixture();
  const outside = mkdtempSync(join(tmpdir(), "visual-acceptance-outside-"));
  roots.push(outside);
  writeFileSync(join(outside, "reference.png"), "reference");
  const path = "docs/visual-acceptance/redesign/references/linked.png";
  symlinkSync(join(outside, "reference.png"), join(root, path));
  surface.references[0].path = path;
  surface.references[0].sha256 = sha256("reference");
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(
    result.errors.join("\n"),
    /resolves outside the repository root: docs\/visual-acceptance\/redesign\/references\/linked\.png/u,
  );
});

test("rejects a visual surface with no required regions", () => {
  const { root, surface } = fixture();
  surface.requiredRegions = [];
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(result.errors.join("\n"), /requiredRegions must not be empty/u);
});

test("records a user-visible approval request as a separate progress state", () => {
  const { root, surface, write } = fixture();
  const candidate = {
    ...surface.references[0],
    path: "docs/visual-acceptance/redesign/candidates/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/candidates/overview.png",
      "candidate",
    ),
  };
  surface.state = "approval_requested";
  surface.candidates = [candidate];
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
    sha256: write(
      "docs/visual-acceptance/redesign/comparisons/overview.md",
      "comparison",
    ),
  };
  surface.approvalRequest = {
    requestedAt: "2026-08-09T11:59:00.000Z",
    source: "conversation:example",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.deepEqual(result.errors, []);
  assert.equal(result.progress.approvalRequested, 1);
  assert.equal(result.progress.memberAccepted, 0);

  surface.approvalRequest.requestedAt = "August 9, 2026";
  assert.match(
    validateManifest(
      { version: 1, initiative: "redesign", surfaces: [surface] },
      { root },
    ).errors.join("\n"),
    /requestedAt must be an ISO timestamp/u,
  );
  surface.approvalRequest.requestedAt = "2026-08-09T11:59:00.000Z";

  candidate.sha256 = write(candidate.path, "revised candidate");
  const staleRequest = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(
    staleRequest.errors.join("\n"),
    /approvalRequest\.candidateSetSha256/u,
  );
});

test("rejects acceptance when approval was never requested", () => {
  const { root, surface, write } = fixture();
  const candidate = {
    ...surface.references[0],
    path: "docs/visual-acceptance/redesign/candidates/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/candidates/overview.png",
      "candidate",
    ),
  };
  surface.state = "member_accepted";
  surface.candidates = [candidate];
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
    sha256: write(
      "docs/visual-acceptance/redesign/comparisons/overview.md",
      "comparison",
    ),
  };
  surface.approval = {
    approvedBy: "Product owner",
    approvedAt: "2026-08-09T12:00:00.000Z",
    source: "https://example.test/reviews/1",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  const result = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.match(result.errors.join("\n"), /approvalRequest/u);
});

test("formats the exact human approval prompt", () => {
  const { root, surface } = fixture();
  surface.state = "approval_requested";
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
  };
  surface.deviations = [];
  surface.approvalRequest = {
    candidateSetSha256: `sha256:${"a".repeat(64)}`,
  };
  assert.equal(
    formatApprovalRequest(surface, { root }),
    [
      "Approval required: overview: A",
      `Comparison: [Open comparison](<${root}/docs/visual-acceptance/redesign/comparisons/overview.md>)`,
      `Candidate set: sha256:${"a".repeat(64)}`,
      "Deviations: None",
      "",
      "Do you approve this exact production candidate?",
      'Reply "Approve" or "Reject".',
    ].join("\n"),
  );
});

function requested() {
  const { root, surface, write } = fixture();
  const candidate = {
    ...surface.references[0],
    path: "docs/visual-acceptance/redesign/candidates/overview.png",
    sha256: write(
      "docs/visual-acceptance/redesign/candidates/overview.png",
      "candidate",
    ),
  };
  surface.state = "approval_requested";
  surface.candidates = [candidate];
  surface.comparison = {
    path: "docs/visual-acceptance/redesign/comparisons/overview.md",
    sha256: write(
      "docs/visual-acceptance/redesign/comparisons/overview.md",
      "comparison",
    ),
  };
  surface.approvalRequest = {
    requestedAt: "2026-08-09T11:59:00.000Z",
    source: "conversation:example",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  return { candidate, root, surface, write };
}

const review = (candidate, overrides = {}) => ({
  reviewer: "reviewer:fresh-context",
  reviewedAt: "2026-08-09T11:50:00.000Z",
  source: "conversation:review",
  candidateSetSha256: candidateSetSha256([candidate]),
  findings: 3,
  open: 0,
  ...overrides,
});

test("requires a bound pre-request review only where the policy asks for it", () => {
  const { candidate, root, surface } = requested();
  const manifest = (policy) => ({
    version: 1,
    initiative: "redesign",
    ...(policy ? { policy } : {}),
    surfaces: [surface],
  });
  assert.deepEqual(validateManifest(manifest(), { root }).errors, []);
  assert.deepEqual(
    validateManifest(manifest({ preRequestReview: "required" }), { root }).errors,
    [
      "surfaces[0].preRequestReview is required by policy before approval is requested",
      "surfaces[0].approvalRequest.attempt is required by policy when approval is requested",
    ],
  );
  surface.preRequestReview = review(candidate);
  surface.approvalRequest.attempt = 1;
  assert.deepEqual(
    validateManifest(manifest({ preRequestReview: "required" }), { root }).errors,
    [],
  );
  surface.state = "member_accepted";
  surface.approval = {
    approvedBy: "member",
    approvedAt: "2026-08-09T12:05:00.000Z",
    source: "conversation:example",
    candidateSetSha256: candidateSetSha256([candidate]),
  };
  assert.deepEqual(
    validateManifest(manifest({ preRequestReview: "required" }), { root }).errors,
    [],
  );
  delete surface.preRequestReview;
  delete surface.approvalRequest.attempt;
  const skipped = [
    "surfaces[0].preRequestReview is required by policy before approval is requested",
    "surfaces[0].approvalRequest.attempt is required by policy when approval is requested",
  ];
  assert.deepEqual(
    validateManifest(manifest({ preRequestReview: "required" }), { root }).errors,
    skipped,
    "an accepted row cannot have skipped the review",
  );
  const from = (preRequestReviewFrom) =>
    validateManifest(
      manifest({ preRequestReview: "required", preRequestReviewFrom }),
      { root },
    ).errors;
  assert.deepEqual(
    from("2026-08-09T11:59:00.001Z"),
    [],
    "a request made before the policy took effect stays valid",
  );
  assert.deepEqual(
    from("2026-08-09T11:59:00.000Z"),
    skipped,
    "a request made when the policy took effect needs the review",
  );
  assert.deepEqual(from("2026-08-09"), [
    "policy.preRequestReviewFrom must be an ISO timestamp when set",
    ...skipped,
  ]);
  assert.deepEqual(
    validateManifest(manifest({ preRequestReview: "optional" }), { root }).errors,
    ['policy.preRequestReview must be "required" when set'],
  );
});

test("rejects a pre-request review that is stale, open or malformed", () => {
  const { candidate, root, surface } = requested();
  surface.preRequestReview = review(candidate, {
    candidateSetSha256: `sha256:${"b".repeat(64)}`,
    findings: -1,
    open: 2,
    reviewer: "",
  });
  const { errors } = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.deepEqual(errors, [
    "surfaces[0].preRequestReview.reviewer must be non-empty",
    "surfaces[0].preRequestReview.findings must be a non-negative integer",
    "surfaces[0].preRequestReview.open must be 0",
    `surfaces[0].preRequestReview.candidateSetSha256 is sha256:${"b".repeat(64)}; expected ${candidateSetSha256([candidate])}`,
  ]);
});

test("rejects a pre-request review recorded before candidates are compared", () => {
  const { root, surface } = fixture();
  surface.preRequestReview = review(surface.references[0]);
  const { errors } = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.deepEqual(errors, [
    "surfaces[0].preRequestReview must be absent before compared",
  ]);
});

test("rejects an approval attempt that is not a positive integer", () => {
  const { root, surface } = requested();
  surface.approvalRequest.attempt = 0;
  const { errors } = validateManifest(
    { version: 1, initiative: "redesign", surfaces: [surface] },
    { root },
  );
  assert.deepEqual(errors, [
    "surfaces[0].approvalRequest.attempt must be a positive integer",
  ]);
});

test("formats one request for several surfaces and shows review and attempt", () => {
  const first = requested();
  first.surface.preRequestReview = review(first.candidate);
  first.surface.approvalRequest.attempt = 2;
  const second = { ...first.surface, id: "detail", selection: "B" };
  delete second.preRequestReview;
  second.approvalRequest = { ...first.surface.approvalRequest, attempt: 1 };
  const comparison = `${first.root}/docs/visual-acceptance/redesign/comparisons/overview.md`;
  const hash = first.surface.approvalRequest.candidateSetSha256;
  assert.equal(
    formatApprovalRequests([first.surface, second], { root: first.root }),
    [
      "Approval required for 2 surfaces",
      "",
      "Approval required: overview: A",
      `Comparison: [Open comparison](<${comparison}>)`,
      `Candidate set: ${hash}`,
      "Deviations: None",
      "Pre-request review: reviewer:fresh-context, 3 findings, 0 open",
      "Attempt: 2",
      "",
      "Approval required: detail: B",
      `Comparison: [Open comparison](<${comparison}>)`,
      `Candidate set: ${hash}`,
      "Deviations: None",
      "",
      "Do you approve these exact production candidates?",
      'Reply "Approve all", or answer each surface: "Approve <surface id>" or "Reject <surface id>" with every finding.',
    ].join("\n"),
  );
  assert.equal(
    formatApprovalRequests([second], { root: first.root }),
    formatApprovalRequest(second, { root: first.root }),
  );
  first.surface.preRequestReview.findings = 1;
  assert.match(
    formatApprovalRequest(first.surface, { root: first.root }),
    /^Pre-request review: reviewer:fresh-context, 1 finding, 0 open$/mu,
  );
  assert.throws(() => formatApprovalRequests([], { root: first.root }), TypeError);
});

const validatorPath = fileURLToPath(
  new URL(
    "../skills/engineering/setup-matt-pocock-skills/validate-visual-acceptance.mjs",
    import.meta.url,
  ),
);
const cli = (root, ...args) => {
  const { status, stderr, stdout } = spawnSync(
    process.execPath,
    [validatorPath, ...args],
    { cwd: root, encoding: "utf8" },
  );
  return { status, stderr, stdout };
};

test("prints one request for several surfaces from the command line", () => {
  const { candidate, root, surface, write } = requested();
  surface.preRequestReview = review(candidate);
  surface.approvalRequest.attempt = 1;
  const detail = { ...surface, id: "detail", selection: "B" };
  write(
    "manifest.json",
    JSON.stringify({
      version: 1,
      initiative: "redesign",
      policy: { preRequestReview: "required" },
      surfaces: [surface, detail],
    }),
  );
  const both = cli(root, "manifest.json", "--print-request=overview,detail");
  assert.equal(both.status, 0, both.stderr);
  assert.equal(
    both.stdout,
    `${formatApprovalRequests([surface, detail], { root })}\n`,
  );
  const one = cli(root, "manifest.json", "--print-request=detail");
  assert.equal(one.stdout, `${formatApprovalRequest(detail, { root })}\n`);

  const unknown = cli(root, "manifest.json", "--print-request=overview,missing");
  assert.equal(unknown.status, 1);
  assert.equal(unknown.stdout, "");
  assert.match(unknown.stderr, /missing is not awaiting approval/u);
  const empty = cli(root, "manifest.json", "--print-request=");
  assert.equal(empty.status, 2);
  assert.match(empty.stderr, /--print-request requires a surface id/u);
});

test("lists changed frames from the command line without reading evidence", () => {
  const { candidate, root, surface, write } = requested();
  const manifest = { version: 1, initiative: "redesign", surfaces: [surface] };
  write("previous.json", JSON.stringify(manifest));
  surface.candidates = [{ ...candidate, sha256: `sha256:${"e".repeat(64)}` }];
  write("manifest.json", JSON.stringify(manifest));

  const plain = cli(root, "manifest.json");
  assert.equal(plain.status, 1, "the edited digest no longer matches its file");
  const changed = cli(root, "manifest.json", "--changed-since=previous.json");
  assert.equal(changed.status, 0, changed.stderr);
  assert.equal(
    changed.stdout,
    "overview: 1 changed, 0 added, 0 removed, 0 unchanged\n  changed en|1440x1000|ready\n",
  );
  assert.equal(
    cli(root, "previous.json", "--changed-since=previous.json").stdout,
    "No candidate frame changed.\n",
  );

  const empty = cli(root, "manifest.json", "--changed-since=");
  assert.equal(empty.status, 2);
  assert.match(empty.stderr, /--changed-since requires a previous manifest path/u);
  write("not-a-manifest.json", JSON.stringify({ surfaces: "none" }));
  const malformed = cli(root, "manifest.json", "--changed-since=not-a-manifest.json");
  assert.equal(malformed.status, 1);
  assert.match(malformed.stderr, /needs two manifests with a surfaces array/u);
});

test("lists the candidate frames that changed since an earlier manifest", () => {
  const frame = (scenario, digest) => ({
    locale: "en",
    viewport: "360x800",
    scenario,
    sha256: `sha256:${digest.repeat(64)}`,
  });
  const previous = {
    surfaces: [
      { id: "overview", candidates: [frame("ready", "a"), frame("empty", "b"), frame("gone", "c")] },
      { id: "detail", candidates: [frame("ready", "d")] },
    ],
  };
  const manifest = {
    surfaces: [
      { id: "overview", candidates: [frame("ready", "a"), frame("empty", "e"), frame("new", "f")] },
      { id: "detail", candidates: [frame("ready", "d")] },
    ],
  };
  const changed = changedCandidates(manifest, previous);
  assert.deepEqual(changed[1], {
    id: "detail",
    added: [],
    changed: [],
    removed: [],
    unchanged: 1,
  });
  assert.equal(
    formatChangedCandidates(changed),
    [
      "overview: 1 changed, 1 added, 1 removed, 1 unchanged",
      "  changed en|360x800|empty",
      "  added en|360x800|new",
      "  removed en|360x800|gone",
    ].join("\n"),
  );
  assert.equal(
    formatChangedCandidates(changedCandidates(manifest, manifest)),
    "No candidate frame changed.",
  );
});
