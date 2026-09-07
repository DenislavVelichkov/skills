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
