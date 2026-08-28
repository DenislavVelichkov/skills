---
name: implement
description: "Implement one approved ticket or a small plan retained in the current conversation. Never implement a published spec before to-tickets splits it."
disable-model-invocation: true
---

Implement one approved ticket, or one small piece of work whose entire plan remains in the current conversation.

If the user passes a spec, plan, Wayfinder map, or `spec.md` path, do not edit production code. Check the configured tracker:

- If no approved implementation ticket set exists, stop and tell the user to run `/to-tickets`.
- If tickets exist, require one exact ticket path or tracker identity. Do not implement the whole spec or choose several tickets.

One invocation handles one ticket or one small same-session change.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

First decide whether the ticket or parent spec contains a visual parity action.
It does only when either document requires a named production surface to be
compared against a visual reference, requires selecting and freezing that
reference for the later comparison, or links an existing manifest that records
either obligation. UI work without that obligation uses the normal
implementation path and no manifest.

For a visual parity action, read `docs/agents/visual-acceptance.md` completely.
Before editing production code, locate the manifest and the ticket's surface
row. If either is missing or invalid, create or repair it from the installed
template, the exact ticket, and its parent spec, following the protocol's
Planning prerequisite.
Run the validator until it passes. Never invent references, hashes, state
transitions, or approval.

A valid `planned` manifest permits ticket drafting, not implementation. Require
the ticket's surface to be at least `design_selected`, with durable reference
files and verified hashes, before editing production code. If it is still
`planned`, leave the newly created or repaired manifest valid, report the exact
design evidence still required, and stop. Work only the confirmed surface.

If the surface is `approval_requested`, verify its candidates and request hash,
run the validator with `--print-request=<surface-id>`, copy its stdout verbatim
as the entire response, and end the turn. Do no other work until the human
replies `Approve` or `Reject`.

For a surface below `approval_requested`:

1. Implement and validate the real application without changing visual
   baselines; set the surface to `implemented`.
2. Commit the implementation candidate and use /code-review. Fix accepted
   findings before capturing final candidates.
3. Capture every required candidate, record its hash and side-by-side
   comparison, set `compared`, and run the manifest validator.
4. Record the approval request with its candidate-set hash, set
   `approval_requested`, and validate again.
5. Report all five progress counters. End the final response with the
   verbatim output of the validator's `--print-request=<surface-id>` command
   and no text after it.

An immediate `Approve` response is bound to the displayed surface and hash. On
approval, verify the candidate files and hashes are unchanged, record it, set
`member_accepted`, promote the accepted bytes to the regression baselines,
rerun the visual suite, and set `baseline_promoted`. On rejection or a
candidate-changing edit, clear the request and return to `compared` before
recapturing. Never infer approval from "continue", prototype selection, green
tests, or a clean review.

For work without a visual parity action, once done use /code-review to review
the work.

Commit your work to the current branch.
