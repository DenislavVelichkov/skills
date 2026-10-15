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

1. Read the spec and tickets to understand the task graph. Read [model execution verification](../implement/MODEL-EXECUTION.md) to distinguish assessed and unassessed work. For each ticket, use an applicable assessment from the ticket, plan, or conversation. Unassessed tickets proceed with current or inherited settings without invoking the selector, requesting a model choice, or probing/binding the gate. For assessed tickets, resolve the current client's available-now model and effort; incomplete or stale assessments block that ticket. A mixed graph does not require every ticket to be assessed.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. For assessed tickets, pass both exact model and reasoning effort through supported runtime controls, accounting for fixed role overrides; include the recommendation snapshot, revision, and model-gate reference. For unassessed tickets, leave model and effort at the existing or inherited settings and identify the ticket as unassessed in the handoff. Each implementer subagent:
   - for an assessed ticket, probes and binds its recommendation in its own session before any implementation or worktree reset and returns the verified native runtime receipt; a parent receipt does not verify a worker. An unassessed ticket needs no gate receipt;
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket;
   - merges the integration branch tip into its own branch before reporting done

5. Require the usual acceptance evidence from every implementer. For assessed tickets, also require the final verified model-gate receipt in the worker's native tool output; a self-reported model name is insufficient, and missing access to that evidence blocks acceptance. Unassessed tickets require no model-gate receipt. Merge its work to the integration branch with a **merger subagent**. A merger that changes code or resolves conflicts for an assessed ticket must bind its recommendation first; incompatible ticket settings require separate workers. Merges involving only unassessed tickets use existing settings without a gate. A blocked worker cannot make its dependents ready.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, call the Skill tool with `code-review` on the integration branch. Route accepted fixes to the affected ticket implementers. For assessed tickets, re-probe and rebind every resumed or replacement worker to the recommended pair; an unbound coordinator cannot implement those fixes. Unassessed tickets retain the ordinary fix workflow without model verification. Recheck assessment status on resume so newly recorded recommendations take effect.

8. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

9. Finish each active successful model gate, abort unfinished bindings, remove temporary ticket snapshots, and clean up all **implementer subagent** worktrees. Record expected and observed model/effort and any mismatches for assessed tickets; report unassessed tickets without inventing recommendations or verification receipts.
