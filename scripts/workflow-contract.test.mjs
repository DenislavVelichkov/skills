import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");

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
