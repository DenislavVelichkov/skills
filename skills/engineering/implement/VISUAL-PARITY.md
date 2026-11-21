# Visual parity action

Read this only for a visual parity action, as defined in SKILL.md. `docs/agents/visual-acceptance.md` in the target repo is the schema authority; this file orders the steps.

## Prerequisite

For a visual parity action, read `docs/agents/visual-acceptance.md` completely.
Always report its five progress counters for this action.
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

Once the manifest and surface row validate, follow the surface state below
before editing production code.

## Surface states

A valid `planned` manifest permits ticket drafting, not implementation. Require
the ticket's surface to be at least `design_selected`, with durable reference
files and verified hashes, before editing production code. If it is still
`planned`, leave the newly created or repaired manifest valid, report the exact
design evidence still required, and stop. Work only the confirmed surface.

For `approval_requested`, handle a bound human response before redisplaying
the pending request.
An immediate `Approve` response is bound to the displayed surface and hash. On
approval, verify the candidate files and hashes are unchanged, record it, and
set `member_accepted`. On rejection or a candidate-changing edit, including
after acceptance, clear the surface's `approvalRequest`, `preRequestReview`,
`approval`, and `baselines` entries and return to
`compared` before revising and recapturing. Repair every finding the rejection
lists, then resume at the draft loop below. Preserve existing baseline files
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
after it. Do no other work on this surface until the human replies `Approve`
or `Reject`; its capture lane stays released meanwhile.

For a surface below `approval_requested`, resume at the first unfinished or
invalidated step. Reuse completed steps only when the project verifier proves
their evidence applies to the current candidate:

1. Implement and validate the real application without changing visual
   baselines; set the surface to `implemented`.
   Inspect focused rendered comparisons against the selected reference during
   implementation, including relevant enabled controls and
   normal and enlarged text. Check the affected platform; a mock cannot prove
   native rendering. Correct feasible mismatches and inspect related shared
   components. Batch feasible related fixes before final review and affected
   captures. Use supported diagnostic paths with their existing state prerequisites.
2. Complete the committed-candidate review required by the invoking workflow,
   including accepted fixes, before the proof run.
3. Pass the protocol's lane preflight, then take a capture lane and run the
   draft loop. Capture draft candidates through the proof run's capture path.
   Obtain the protocol's "Pre-request review" from a reviewer with a fresh
   context window who is not this implementer: start one where the host
   allows, otherwise request it from the invoking workflow. Give every
   finding a disposition and recapture the frames a repair can move. The loop
   is done when the reviewer returns no open finding. Drafts add no manifest
   state.
4. Make one proof run. Supply every required candidate and side-by-side comparison. Apply the
   repository protocol's "Comparison presentation" through the existing producer
   and consumer, including numbered difference pointers and pair-bound inspection.
   Diagnostic images replace no final coverage or acceptance and add no manifest state.
   Where the project requires a complete native parent, keep that requirement;
   focused checks and partial captures cannot satisfy it. Reuse existing
   evidence only through project-supported validation of its applicability to
   the current candidate; capture missing or invalidated evidence. Have the
   reviewer inspect every frame whose bytes differ from the last reviewed
   draft, record `preRequestReview` and the hashes, set `compared`, and run
   the manifest validator.
5. Record the approval request with its candidate-set hash and `attempt`, set
   `approval_requested`, validate again, and release the capture lane.
6. Report all five progress counters. End the final response with the
   verbatim output of the validator's `--print-request=<surface-id>` command
   and no text after it.
