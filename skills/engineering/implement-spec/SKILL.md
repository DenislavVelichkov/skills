---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph. Read [model execution verification](../implement/MODEL-EXECUTION.md) and run its probe to confirm the hook works. Resolve each ticket's current, client-specific available-now model and effort before dispatch. Missing or stale recommendations block that ticket; do not silently route it to the coordinator's settings.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Pass both exact model and reasoning effort through supported runtime controls, accounting for fixed role overrides. Include the ticket snapshot, revision, and model-gate reference in every worker handoff. Each implementer subagent:
   - binds its ticket in its own session before any implementation or worktree reset and returns the verified native runtime receipt; a parent receipt does not verify a worker;
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket;
   - merges the integration branch tip into its own branch before reporting done

5. Accept an implementer only with its final verified model-gate receipt and required acceptance evidence. Confirm the receipt in the worker's native tool output; a self-reported model name is insufficient. Missing access to that evidence blocks acceptance. Merge its work to the integration branch with a **merger subagent**. A merger that changes code or resolves conflicts must bind the affected ticket under its recommended pair first; incompatible ticket settings require separate workers. A blocked worker cannot make its dependents ready.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, call the Skill tool with `code-review` on the integration branch. Route accepted fixes to implementers bound to the affected tickets and their recommended pairs. Re-probe and rebind every resumed or replacement worker. Do not let an unbound coordinator implement fixes.

8. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

9. Finish each successful model gate, abort unfinished bindings, remove temporary ticket snapshots, and clean up all **implementer subagent** worktrees. Record expected and observed model/effort and any mismatches with each ticket's outcome.
