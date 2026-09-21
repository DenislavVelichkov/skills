import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");

test("an unrelated test edit cannot authorize visual evidence reuse", () => {
  const implement = read("skills/engineering/implement/SKILL.md");
  assert.match(implement, /\[proportionate verification\]\(VERIFICATION.md\)/u);
  const policy = read("skills/engineering/implement/VERIFICATION.md");
  assert.match(policy, /only when the project verifier supports it and proves/u);
  assert.match(policy, /direct\nand transitive source dependencies/u);
  assert.match(policy, /Unknown dependencies require conservative revalidation/u);
  assert.match(policy, /Never relabel an old capture as a new run/u);
  assert.match(policy, /respect the existing validator/u);
});

test("shared fixes precede consumer evidence without changing approved order", () => {
  const ticketing = read("skills/engineering/to-tickets/SKILL.md");
  assert.match(ticketing, /repairs before consumers' final evidence/u);
  assert.match(ticketing, /affected behavior, focused checks, reusable evidence inputs/u);
  assert.match(ticketing, /where the approved workflow permits/u);
  assert.match(ticketing, /Preserve that chain\nuntil the user explicitly approves/u);
  assert.match(ticketing, /does not change\nan active project's order or authorize parallel implementation/u);
});

test("a stable fix ends verification while retaining full initial review coverage", () => {
  const tdd = read("skills/engineering/tdd/SKILL.md");
  const review = read("skills/engineering/code-review/SKILL.md");
  assert.match(tdd, /Run the focused test during red-green/u);
  assert.match(tdd, /required final suite on the stable candidate/u);
  assert.match(tdd, /failures, uncertain impact, and project gates/u);
  assert.match(review, /first review covers the full requested diff/u);
  assert.match(review, /affected callers, contracts,/u);
  assert.match(review, /delta review alone cannot stand in for a missing initial review/u);
  assert.match(review, /After required checks and both axes pass, stop reviewing that unchanged scope/u);
  assert.match(review, /follow stricter project requirements/u);
});

test("published specs must pass through an approved ticket split", () => {
  const toSpec = read("skills/engineering/to-spec/SKILL.md");
  const toTickets = read("skills/engineering/to-tickets/SKILL.md");
  const implement = read("skills/engineering/implement/SKILL.md");
  const localTracker = read(
    "skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md",
  );

  assert.match(toSpec, /Do not apply `ready-for-agent`/u);
  assert.match(toSpec, /Never edit production code/u);
  assert.match(
    toTickets,
    /\.scratch\/<feature-slug>\/implementation\/issues\/<NN>-<slug>\.md/u,
  );
  assert.match(toTickets, /Never append it to the parent planning/u);
  assert.match(
    implement,
    /If no approved implementation ticket set exists, stop/u,
  );
  assert.match(implement, /Do not implement the whole spec/u);
  assert.match(
    localTracker,
    /spec is input to ticket splitting, not an implementation work order/u,
  );
});

test("visual acceptance stays local and human-approved", () => {
  const toTickets = read("skills/engineering/to-tickets/SKILL.md");
  const visualAcceptance = read(
    "skills/engineering/setup-matt-pocock-skills/visual-acceptance.md",
  );

  assert.match(toTickets, /repo-local validator/u);
  assert.doesNotMatch(
    `${toTickets}\n${visualAcceptance}`,
    /required CI|CODEOWNERS|branch protection/u,
  );
  assert.match(
    visualAcceptance,
    /Run it locally before each state change and\nbefore claiming completion\./u,
  );
  assert.match(visualAcceptance, /it must never invent,\ninfer, or self-author approval/u);
});

test("visual parity gates require an explicit reference comparison", () => {
  const setup = read(
    "skills/engineering/setup-matt-pocock-skills/SKILL.md",
  );
  const visualAcceptance = read(
    "skills/engineering/setup-matt-pocock-skills/visual-acceptance.md",
  );
  const wayfinder = read("skills/engineering/wayfinder/SKILL.md");
  const toSpec = read("skills/engineering/to-spec/SKILL.md");
  const toTickets = read("skills/engineering/to-tickets/SKILL.md");
  const implement = read("skills/engineering/implement/SKILL.md");
  const codeReview = read("skills/engineering/code-review/SKILL.md");

  assert.match(
    visualAcceptance,
    /Compare <production surface> against <visual reference>/u,
  );
  assert.match(
    visualAcceptance,
    /Select and freeze <visual reference> so <production surface> can be/u,
  );
  assert.match(
    visualAcceptance,
    /without a production-to-reference comparison creates no manifest and adds no/u,
  );
  assert.match(
    visualAcceptance,
    /A proposed manifest path or a\nrequest to create a new manifest does not establish it/u,
  );
  assert.match(setup, /UI\s+work\s+without that comparison uses no manifest/u);

  for (const skill of [wayfinder, toSpec, toTickets, implement, codeReview]) {
    assert.match(skill, /visual parity action/u);
    assert.match(
      skill,
      /existing\s+manifest that records\s+either obligation/u,
    );
  }

  assert.match(
    codeReview,
    /A\s+visual diff, prototype, or screenshot without that obligation creates no\s+visual delivery gate/u,
  );
});

test("applicable missing manifests are created before ticketing or implementation", () => {
  const visualAcceptance = read(
    "skills/engineering/setup-matt-pocock-skills/visual-acceptance.md",
  );
  const toSpec = read("skills/engineering/to-spec/SKILL.md");
  const toTickets = read("skills/engineering/to-tickets/SKILL.md");
  const implement = read("skills/engineering/implement/SKILL.md");

  assert.match(visualAcceptance, /before either phase begins/u);
  assert.match(toSpec, /Do not stop merely because it is absent/u);
  assert.match(
    toTickets,
    /Do not draft, quiz, or publish any tickets until the validator passes/u,
  );
  assert.match(toTickets, /missing or invalid, create or repair it/u);
  assert.match(implement, /Before editing production code/u);
  assert.match(implement, /missing or invalid, create or repair it/u);
  assert.match(
    implement,
    /A valid `planned` manifest permits ticket drafting, not implementation/u,
  );
});

// These assertions check instruction contracts, not observed agent behavior.
test("validation selects desktop behavior, native exceptions, and complete final proof", () => {
  const policy = read("skills/engineering/implement/VERIFICATION.md");
  for (const text of ["focused desktop tests", "exposes production behavior",
    "only at established test boundaries", "cannot otherwise reach it",
    "extract the minimum needed", "focused native", "native-only case",
    "cannot certify native behavior", "after its desktop regression passes",
    "Run all required final checks on the final candidate"]) {
    assert.ok(policy.includes(text), text);
  }
  for (const name of ["tdd", "diagnosing-bugs", "to-tickets"]) {
    assert.match(read(`skills/engineering/${name}/SKILL.md`), /\(\.\.\/implement\/VERIFICATION.md\)/u);
  }
});


test("reports stay passive and live reuse expires at real operation boundaries", () => {
  const policy = read("skills/engineering/implement/VERIFICATION.md");
  for (const text of ["Keep audits, refresh plans and visual reviews passive", "per profile and relevant input state", "before native work", "review pause expires", "holding a lease alone", "old client projection before ordinary", "reject later drift", "including failed operations", "human waiting separately"]) assert.ok(policy.includes(text), text);
  const review = read("skills/engineering/code-review/SKILL.md");
  assert.match(review, /\.\.\/implement\/VERIFICATION.md/u);
  assert.match(review, /Review does not authorize runtime execution/u);
});

// Instruction-contract coverage; this does not certify agent behavior.
test("feature verification bounds shared-tooling repairs and debugging effort", () => {
  const policy = read("skills/engineering/implement/VERIFICATION.md");
  for (const text of ["exact required check it cannot run", "smallest repair and its completion criterion",
    "report tooling work separately from feature completion", "Once that check works, return to the feature",
    "Generalization for future packages", "does not waive evidence, security, accessibility"]) {
    assert.ok(policy.includes(text), text);
  }
  const diagnosis = read("skills/engineering/diagnosing-bugs/SKILL.md");
  assert.ok(diagnosis.includes("Stop improving it"));
  assert.ok(diagnosis.includes("Choose a bounded trial count"));
  assert.ok(diagnosis.includes("Native or external-service checks may take minutes"));
  assert.doesNotMatch(diagnosis, /Spend disproportionate effort|Treat the loop as a product|seconds, not minutes/u);
});

// Expected next actions in installed instructions, not measured agent execution.
for (const [situation, file, action] of [
  ["hidden dependency", "implement/VERIFICATION.md", "Name missing dependencies and their existing owners before substantial component work"],
  ["missing ordinary entry", "implement/VERIFICATION.md", "If components have no ordinary entry, make connecting that path the next authorized batch"],
  ["settled authorization", "implement/VERIFICATION.md", "Carry confirmed scope, authorization, decisions and test boundaries forward"],
  ["inferable review baseline", "code-review/SKILL.md", "use the recorded task-start commit"],
  ["unresolved design", "implement/VERIFICATION.md", "Ask only for consequential unresolved decisions"],
  ["delta review", "code-review/SKILL.md", "review the delta from the last reviewed candidate plus affected callers"],
  ["disconnected progress", "implement/VERIFICATION.md", "Component completion cannot close a ticket whose required user path remains disconnected"],
]) {
  test(`${situation}: prescribed next action is ${action}`, () => {
    const instructions = read(`skills/engineering/${file}`).replace(/\s+/gu, " ");
    assert.ok(instructions.includes(action), action);
  });
}

test("connected batches retain scope and route through shared guidance", () => {
  const policy = read("skills/engineering/implement/VERIFICATION.md").replace(/\s+/gu, " ");
  for (const action of ["ordinary entry, demonstrable behavior and the existing check",
    "real authorization, validated contracts and persistence",
    "security, data integrity and essential accessibility",
    "timer or context-window cutoff", "remaining requirements and their existing owners",
    "design selection does not grant exact production acceptance"]) assert.ok(policy.includes(action), action);
  for (const skill of ["implement", "to-tickets", "tdd", "code-review"]) {
    assert.match(read(`skills/engineering/${skill}/SKILL.md`), /VERIFICATION.md/u);
  }
  assert.doesNotMatch(read("skills/engineering/to-tickets/SKILL.md"), /sized to fit in a single fresh context window/u);
  assert.doesNotMatch(read("skills/engineering/tdd/SKILL.md"), /Before writing any test.*confirm them with the user/u);
  assert.doesNotMatch(read("skills/engineering/code-review/SKILL.md"), /If they didn't specify one, ask for it/u);
});


test("public workflow docs retain connected delivery and settled decisions", () => {
  for (const [file, expected] of [
    ["implement", "Commit the integrated candidate before review"],
    ["to-tickets", "Size it by behavior and dependencies"],
    ["tdd", "Reuse boundaries confirmed in the ticket, spec or conversation"],
    ["code-review", "recorded task-start commit"],
    ["prototype", "neither authorizes production implementation"],
    ["ask-matt", "reviews committed integrated candidates"],
  ]) assert.ok(read(`docs/engineering/${file}.md`).replace(/\s+/gu, " ").includes(expected), file);
  assert.ok(read("docs/productivity/grilling.md").includes("Only consequential unresolved decisions"));
  assert.ok(read("skills/productivity/grilling/SKILL.md").includes("A prior answer"));
  assert.ok(read("skills/engineering/prototype/SKILL.md").includes("Reuse settled design answers"));
});


test("planning and design selection cannot reopen or expand execution authority", () => {
  assert.match(read("skills/engineering/implement/VERIFICATION.md"), /Publishing a plan does not authorize implementation/u);
  assert.match(read("skills/engineering/prototype/UI.md"), /explicit implementation authorization/u);
  assert.doesNotMatch(read("docs/engineering/tdd.md"), /Before any test exists/u);
  assert.match(read("skills/engineering/ask-matt/SKILL.md"), /A published spec always goes through/u);
});
