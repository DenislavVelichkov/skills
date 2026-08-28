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
