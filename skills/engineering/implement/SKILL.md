---
name: implement
description: "Implements one approved ticket or a small plan retained in the current conversation. Never implement a published spec before to-tickets splits it."
---

Implement one approved ticket, or one small piece of work whose entire unpublished plan remains in the current conversation. One invocation handles one ticket or one small same-session change.

If the user passes a spec, a saved or published plan, a Wayfinder map, or a `spec.md` path, do not edit production code. Check the configured tracker:

- If no approved implementation ticket set exists, stop and tell the user to run `/to-tickets`.
- If tickets exist, require one exact ticket path or tracker identity. Do not implement the whole spec or choose several tickets.

For TDD where possible at pre-agreed seams, call the Skill tool with "tdd"; at
review checkpoints, with "code-review". Without a Skill tool, read each named
skill through the host's supported skill-loading mechanism. Report an
unavailable required review rather than claiming it ran. Use `tdd` for every
behavior change; skip it only for changes with none, such as config- or
docs-only edits.

1. **Resolve the work.** For a ticket, read its body, comments, linked
   requirements and blocking status, following `docs/agents/issue-tracker.md`
   when present. Resolve bare numbers only against the configured tracker. If
   identity, implementation authorization or blocker status is unresolved, ask
   before dependent work. Done when you have stated the identity, title, scope
   and commit branch (conversation-only work: the agreed scope and branch),
   without asking again for settled approval.
2. **Model gate.** Follow [model execution verification](MODEL-EXECUTION.md).
   With no applicable model assessment for this ticket, plan or conversation,
   continue with current or inherited settings; require no selector, model
   choice or gate receipt. If a recommendation exists for this client and scope,
   bind it in this session and verify the runtime model and reasoning level.
   Stop on mismatches or missing evidence. The gate stays active through fixes
   and checks and finishes before you report completion.
3. **Record the start.** Record the current branch and task-start commit before
   editing, preserving unrelated changes. If the current branch is the default
   branch, create a feature branch named after the ticket before the first
   commit. Ask only when project instructions name a branch convention you
   cannot satisfy.
4. **Plan verification.** Before planning batches or choosing checks, read
   [VERIFICATION.md](VERIFICATION.md) "Connected delivery" and "Choose the
   check". Read its other sections only when they apply: "Bound verification
   tooling work" before changing verification tooling; "Prepare expensive
   execution" and "Diagnose before repeating expensive work" before costly runs
   or retries; "Reuse evidence safely" before reusing evidence; "Separate
   reports from execution" and "Schedule without repeated work" before live
   validation. Its native UI and capture rules apply only to native UI or visual
   captures. Done when each batch's entry, behavior and checks are recorded.
5. **Decide the visual path.** A visual parity action exists only when the
   ticket or parent spec requires a named production surface to be compared
   against a visual reference, requires selecting and freezing that reference,
   or links an existing manifest recording either. Otherwise UI work uses the
   normal path and no manifest. For a visual parity action, follow
   [VISUAL-PARITY.md](VISUAL-PARITY.md) before editing production code; never
   infer approval from "continue", prototype selection, green tests, or a clean
   review.
6. **Implement.** Run the smallest relevant check after each meaningful change.
   After each batch or result, follow [Select the next action](VERIFICATION.md#select-the-next-action)
   through the remaining authorized work. Visual work uses the sequence above
   for early comparison, final review, capture and human acceptance.
7. **Commit and review.** Commit the integrated candidate to the current branch,
   following documented branch rules, then run code-review with the task-start
   commit and ticket scope. Batch accepted fixes, validate, commit, and review
   their delta plus affected callers, retaining the original coverage. After two
   fix cycles, report remaining required findings as blockers instead of
   starting another.
8. **Finish.** Run the required final suite once on the stable candidate; repeat
   only checks affected by later changes or required by the project contract.
   Record the commits, actual checks, review outcomes, acceptance evidence and
   remaining blockers in the existing ticket or conversation, and follow tracker
   closure rules. Claim completion only when every required gate passes,
   including `baseline_promoted` for its visual surface; otherwise report an
   implementation candidate with acceptance pending.
