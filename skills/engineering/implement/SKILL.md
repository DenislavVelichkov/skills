---
name: implement
description: "Implements one approved ticket or a small plan retained in the current conversation. Never implement a published spec before to-tickets splits it."
disable-model-invocation: true
---

Implement one approved ticket, or one small piece of work whose entire unpublished plan remains in the current conversation.

If the user passes a spec, a saved or published plan, a Wayfinder map, or a `spec.md` path, do not edit production code. Check the configured tracker:

- If no approved implementation ticket set exists, stop and tell the user to run `/to-tickets`.
- If tickets exist, require one exact ticket path or tracker identity. Do not implement the whole spec or choose several tickets.

One invocation handles one ticket or one small same-session change.

For ticket work, read the exact ticket's body, comments, linked requirements
and blocking status before editing, following `docs/agents/issue-tracker.md`
when present.
Resolve bare numbers only against the configured tracker, never an unrelated
list. If identity, implementation authorization or blocker status is unresolved,
ask for the missing input before dependent work. State the resolved identity,
title and scope without asking again for settled approval.
For conversation-only work, restate the agreed scope.

Before implementation, follow [model execution verification](MODEL-EXECUTION.md);
with no applicable model assessment, continue with the current settings.

Record the current branch and task-start commit before editing, preserving
unrelated changes. If the current branch is the default branch, create a
feature branch named after the ticket before the first commit. Ask only when
project instructions name a branch convention you cannot satisfy.

Call the Skill tool with "tdd" for any behavior change; it chooses the seams.
Skip it only for changes with no behavior change, such as config- or docs-only edits.

Read the [proportionate verification](VERIFICATION.md) section that matches the
moment: "Connected delivery" before planning batches; "Choose the check" before
choosing checks; "Bound verification tooling work" before changing verification
tooling; "Prepare expensive execution" and "Diagnose before repeating expensive
work" before a long, native or stateful run or a retry; "Reuse evidence safely"
before reusing evidence; "Separate reports from execution" and "Schedule without
repeated work" before live validation or a report. Checklist:

- Run the smallest relevant check after each meaningful change.
- After each batch or result, follow [Select the next action](VERIFICATION.md#select-the-next-action)
  through the remaining authorized work.
- Apply the preparation and diagnosis sections above before an expensive run
  or retry.
- Run the required final suite once on the stable candidate; repeat only checks
  affected by later changes or required by the project contract.

First decide whether the ticket or parent spec contains a visual parity action.
It does only when either document requires a named production surface to be
compared against a visual reference, requires selecting and freezing that
reference for the later comparison, or links an existing manifest that records
either obligation. UI work without that obligation uses the normal
implementation path and no manifest.

For a visual parity action, follow [VISUAL-PARITY.md](VISUAL-PARITY.md) from
its prerequisite before editing production code.

For either implementation path, commit the integrated candidate so the full
change is visible, then call the Skill tool with "code-review" to review the
work. Supply the task-start commit and ticket scope. Batch accepted fixes, validate them, commit
and review their delta plus affected callers, retaining the original review
coverage. Run at most one fix batch and one delta review; report findings that
remain after that as blockers. Report an unavailable required review rather than claiming it ran.

Commit your work to the current branch.
Record the commits, actual checks and review outcomes, acceptance evidence and
remaining blockers in the existing ticket or conversation. Follow tracker
closure rules. Claim ticket completion only when every required gate passes,
including `baseline_promoted` for its visual surface; report an implementation
candidate while acceptance remains pending.
