---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

If the ticket or spec selects or cites a prototype, screenshot, design option,
visual composition, or parity target, require a visual-acceptance manifest. A
missing manifest blocks implementation. Read
`docs/agents/visual-acceptance.md` completely before editing. Confirm the
ticket's surface id and state. Work only that surface.

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

For work without an applicable manifest, once done use /code-review to review
the work.

Commit your work to the current branch.
