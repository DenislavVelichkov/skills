# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Planning, research, and decision issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`.
- Implementation tickets generated from the spec are a separate set at `.scratch/<feature-slug>/implementation/issues/<NN>-<slug>.md`, numbered from `01` in dependency order.
- Never append implementation tickets to the planning, research, or decision issue sequence.
- A spec is input to ticket splitting, not an implementation work order. Do not edit production code from `.scratch/<feature-slug>/spec.md`; wait until the user approves the split and the implementation ticket files exist, then work one unblocked ticket.
- Keep one ticket per file. Never publish a combined tickets file.
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

- Publish planning artifacts and the spec under `.scratch/<feature-slug>/`.
- When `to-tickets` splits that spec, publish the fresh implementation set under `.scratch/<feature-slug>/implementation/issues/`, starting at `01`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly. If the same number exists in both phases, require the path or phase instead of guessing.

## Implementation operations

- **Source contract**: `.scratch/<feature-slug>/spec.md`
- **Implementation ticket**: `.scratch/<feature-slug>/implementation/issues/NN-<slug>.md`
- **Execution gate**: the user-approved split must exist before production edits begin.
- **Frontier**: scan only the implementation ticket set for tickets whose blockers are complete. Never treat the parent spec or resolved planning tickets as executable work.
- **Work unit**: one implementation run handles one ticket.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
