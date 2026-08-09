import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import {
  candidateSetSha256,
  formatApprovalRequest,
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
      "Approval required: overview — A",
      `Comparison: [Open comparison](<${root}/docs/visual-acceptance/redesign/comparisons/overview.md>)`,
      `Candidate set: sha256:${"a".repeat(64)}`,
      "Deviations: None",
      "",
      "Do you approve this exact production candidate?",
      'Reply "Approve" or "Reject".',
    ].join("\n"),
  );
});
