---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Before implementation, follow [model execution verification](MODEL-EXECUTION.md).
If this ticket, plan, or conversation has no applicable model assessment, continue
with the current or inherited settings; do not require the selector, a model choice,
or a gate receipt. If a recommendation exists for this client and scope, bind it
in this actual session and verify the runtime model and reasoning level. Stop on
mismatches or missing evidence, keep the gate active through fixes and checks,
and finish it before reporting completion.

Call the Skill tool with "tdd" where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, call the Skill tool with "code-review" to review the work.

Commit your work to the current branch.
