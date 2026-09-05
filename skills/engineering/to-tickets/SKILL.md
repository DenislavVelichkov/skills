---
name: to-tickets
description: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker).
disable-model-invocation: true
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it.

The issue tracker and triage label vocabulary should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

This skill only produces the approved ticket set. A spec is planning input, not an implementation work order. Do not edit production code, invoke `/implement`, or continue into implementation during this skill.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

For a local spec at `.scratch/<feature-slug>/spec.md`, treat the output as a separate implementation effort rooted at `.scratch/<feature-slug>/implementation/`. Do not append implementation tickets to Wayfinder, research, or decision tickets already stored under the parent feature's `issues/` directory.

First decide whether the source contains a visual parity action. It does only
when the source requires a named production surface to be compared against a
visual reference, requires selecting and freezing that reference for the later
comparison, or links an existing manifest that records either obligation. UI
work without that obligation uses ordinary tracer-bullet ticketing and no
manifest.

For a visual parity action, read `docs/agents/visual-acceptance.md` completely.
Before exploring, drafting, or quizzing the user about implementation tickets,
locate the initiative manifest.
If it is missing or invalid, create or repair it from the installed template
and the source decisions, following the protocol's Planning prerequisite. Add
one truthful `planned` row per in-scope surface and run the validator until it
passes. Do not draft, quiz, or publish any tickets until the validator passes.
Never invent references, hashes, state transitions, or approval.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

Plan verification alongside these edges. Put shared primitive or contract
repairs before consumers' final evidence, and give each ticket a short
validation note: affected behavior, focused checks, reusable evidence inputs,
and required final gates. Use existing ticket fields rather than a new ledger.
Group related shared fixes into a bounded checkpoint so each affected consumer
needs expensive evidence only once per stable candidate. Separate evidence
refresh work from feature dependencies where the approved workflow permits;
all affected acceptance claims still need current proof before closure.

If an existing serial acceptance chain prevents independent work, show the
alternative dependency order during the approval step. Preserve that chain
until the user explicitly approves the amendment. This skill does not change
an active project's order or authorize parallel implementation.

For a visual parity action:

- Create an initial validation-setup slice when the project does not yet have a
  repo-local validator for manifests, references, and baselines.
- For every row still at `planned`, create a blocking design-selection ticket
  that freezes durable references and advances the row to `design_selected`.
  The corresponding implementation-and-acceptance ticket depends on it; the
  implementation agent does not make that design decision. Use the configured
  `ready-for-human` state when a human selection is still required; otherwise
  the evidence-freezing work may be `ready-for-agent`.
- Create one implementation-and-acceptance ticket per manifest surface. Keep
  the surface ticket open through candidate comparison, explicit human
  approval, and baseline promotion.
- Default to a linear chain in manifest order so the next surface stays blocked
  until the previous one is `baseline_promoted`. Use another order only when
  the human explicitly approves it.
- Put the manifest path and surface id in the ticket. Acceptance criteria must
  require exact reference/candidate comparison, explicit approval bound to the
  candidate-set hash, and promoted baselines that match the accepted bytes.
- Never let green tests or a clean review satisfy the human-approval criterion.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the tickets to the configured tracker

Publish the approved tickets. **How** depends on the tracker `/setup-matt-pocock-skills` configured; the tickets are the same either way, only the shape of the blocking edges changes:

- **Local files from `.scratch/<feature-slug>/spec.md`** → write one file per ticket under `.scratch/<feature-slug>/implementation/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). This is a fresh implementation set. Never append it to the parent planning or decision sequence.
- **Local files without a parent feature spec** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order.
- In either local form, each file's "Blocked by" lists the numbers and titles it depends on. Use the per-ticket file template below, one ticket per file, never a combined file.
- In local files, change the template status to `ready-for-human` only for a visual design-selection blocker that still needs a human choice.
- **A real issue tracker (GitHub, Linear, …)** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use the platform's native blocking / sub-issue relationship where it has one; otherwise set each ticket's "Blocked by" to the blocking issues. Apply the `ready-for-agent` triage label unless instructed otherwise. A visual design-selection blocker that still requires a human uses `ready-for-human`; its downstream implementation ticket remains `ready-for-agent` but blocked.

After publication, implementation may work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom. `to-tickets` stops before that work begins.

Do NOT close or modify any parent issue or spec.

<local-ticket-template>

# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

</issue-template>

In either form, avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.
