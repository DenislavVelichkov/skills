---
name: implement
description: "Implement one approved ticket or a small plan retained in the current conversation. Never implement a published spec before to-tickets splits it."
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

Record the current branch and task-start commit before editing, preserving
unrelated changes.

For TDD where possible at pre-agreed seams, call the Skill tool with "tdd".
At the review checkpoints below, call the Skill tool with "code-review".
If the host has no Skill tool, discover and read each named skill through its
supported skill-loading mechanism before following it. Report an unavailable
required review rather than claiming it ran.

Read [proportionate verification](VERIFICATION.md), including connected delivery,
before planning batches, choosing checks, reusing evidence, changing verification
tooling, or starting live validation. Keep reports passive and share verified
assessments through the existing controller. Run the smallest relevant check
after a meaningful change. Run the required final suite once on the stable
candidate; repeat only checks affected by later changes or required by the
project contract.

First decide whether the ticket or parent spec contains a visual parity action.
It does only when either document requires a named production surface to be
compared against a visual reference, requires selecting and freezing that
reference for the later comparison, or links an existing manifest that records
either obligation. UI work without that obligation uses the normal
implementation path and no manifest.

For a visual parity action, read `docs/agents/visual-acceptance.md` completely.
Always report its five progress counters for visual work.
If the installed protocol, template or validator is missing, tell the user to
run `/setup-matt-pocock-skills`, report the blocked prerequisite, and stop.
Before editing production code, locate the manifest and the ticket's surface
row. If either is missing or invalid, create or repair it from the installed
template, the exact ticket, and its parent spec, following the protocol's
Planning prerequisite.
Use the protocol's bounded validation and correction step. If validation still
fails or missing input or tooling prevents it, report the blocker and stop
before production edits. Never invent references, hashes, state transitions,
or approval.

A valid `planned` manifest permits ticket drafting, not implementation. Require
the ticket's surface to be at least `design_selected`, with durable reference
files and verified hashes, before editing production code. If it is still
`planned`, leave the newly created or repaired manifest valid, report the exact
design evidence still required, and stop. Work only the confirmed surface.

For `approval_requested`, handle a bound human response before redisplaying
the pending request.
An immediate `Approve` response is bound to the displayed surface and hash. On
approval, verify the candidate files and hashes are unchanged, record it, and
set `member_accepted`. On rejection or a candidate-changing edit, clear the
surface's `approvalRequest`, `approval`, and `baselines` entries and return to
`compared` before revising and recapturing. Preserve existing baseline files
until new approval. Never infer
approval from "continue", prototype selection, green tests, or a clean review.

For `member_accepted`, verify the recorded approval and candidate hashes,
promote the accepted bytes to the regression baselines, rerun the visual suite,
and set `baseline_promoted`. For an unchanged `baseline_promoted` surface,
validate the retained evidence and completion gates without rebuilding or
requesting approval again.

If `approval_requested` remains unresolved, verify its candidates and request
hash, report all five progress counters, and end the response with the verbatim
stdout of the validator's `--print-request=<surface-id>` command and no text
after it. Do no other work until the human replies `Approve` or `Reject`.

For a surface below `approval_requested`, resume at the first unfinished or
invalidated step. Reuse completed steps only when the project verifier proves
their evidence applies to the current candidate:

1. Implement and validate the real application without changing visual
   baselines; set the surface to `implemented`.
2. Complete the committed-candidate review below, including accepted fixes,
   before capturing final candidates.
3. Supply every required candidate and side-by-side comparison. Reuse existing
   evidence only through project-supported validation of its applicability to
   the current candidate; capture missing or invalidated evidence. Record the
   hashes, set `compared`, and run the manifest validator.
4. Record the approval request with its candidate-set hash, set
   `approval_requested`, and validate again.
5. Report all five progress counters. End the final response with the
   verbatim output of the validator's `--print-request=<surface-id>` command
   and no text after it.

For either implementation path, commit the integrated candidate before running
the code-review skill so the full change is visible. Supply the task-start
commit and ticket scope. Batch accepted fixes, validate them, commit and review
their delta plus affected callers, retaining the original review coverage.

Commit your work to the current branch.
Record the commits, actual checks and review outcomes, acceptance evidence and
remaining blockers in the existing ticket or conversation. Follow tracker
closure rules. Claim ticket completion only when every required gate passes,
including `baseline_promoted` for its visual surface; report an implementation
candidate while acceptance remains pending.
