---
name: implement-spec
description: "Implements an approved spec and ticket graph with subagents in isolated worktrees, then validates their combined work on one integration branch. Use after /to-spec and /to-tickets."
disable-model-invocation: true
---

Require a spec and its approved implementation tickets. If the ticket set is missing or unapproved, tell the user to run `/to-tickets` and stop before implementation. Verify ticket identities, blocking edges and any external blockers from the configured tracker. Report cycles or unresolved dependencies before dispatching affected tickets.

Reuse the supplied tracker configuration or its repository instruction pointer. If none is known, tell the user to run `/setup-matt-pocock-skills` and stop before tracker operations.

Check that the host permits subagents and supports isolated worktrees. If it cannot run this workflow, report the missing capability and recommend user-invoked `/implement` per ticket. Do not silently replace it with implementation in a shared checkout.

Load `tdd` and `code-review` through the host's skill tool, or discover and read each registered `SKILL.md` when no such tool exists. Report an unavailable required dependency before its dependent work.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets form a **task graph**. Its **frontier** contains tickets whose blockers have landed on the integration branch with their required acceptance evidence. Track those results during the run; remote issues may remain open until the final PR merges. Preserve external blockers and any approved serial acceptance order. If unfinished tickets remain but none is ready, report their blockers rather than claiming completion.

Read [proportionate verification](../implement/VERIFICATION.md) before choosing checks. Require each implementer to apply its expensive-execution preparation and recurring-failure diagnosis before costly runs or retries. For a ticket with a visual parity action, read the repository's `docs/agents/visual-acceptance.md` and follow its design, comparison, human-approval and baseline gates. A worker cannot satisfy a human gate on the user's behalf.

If the approved acceptance order requires review before the next ticket can start, review the integrated ticket scope at that checkpoint. Retain that coverage for the final spec review; do not report still-blocked tickets as missing implementation in the checkpoint review.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph. Read [model execution verification](../implement/MODEL-EXECUTION.md) to distinguish assessed and unassessed work. For each ticket, use an applicable assessment from the ticket, plan, or conversation. Unassessed tickets proceed with current or inherited settings without invoking the selector, requesting a model choice, or probing/binding the gate. For assessed tickets, resolve the current client's available-now model and effort; incomplete or stale assessments block that ticket. A mixed graph does not require every ticket to be assessed.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Record the task-start commit and create the integration branch from the agreed base. On resume, verify and reuse this effort's existing branch and PR. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5, marked as closing the spec and tickets. Check for an existing PR before retrying an uncertain creation.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. For assessed tickets, pass both exact model and reasoning effort through supported runtime controls, accounting for fixed role overrides; include the recommendation snapshot, revision, and model-gate reference. For unassessed tickets, leave model and effort at the existing or inherited settings and identify the ticket as unassessed in the handoff. Each implementer subagent:
   - for an assessed ticket, probes and binds its recommendation in its own session before implementation and returns the verified native runtime receipt; a parent receipt does not verify a worker. An unassessed ticket needs no gate receipt;
   - confirms its worktree is based on the integration branch before starting; preserves existing changes and commits if it is not, then uses a fresh worktree from the correct base;
   - follows the loaded `tdd` skill to build the ticket within its assigned scope, preserving other workers' changes;
   - merges the integration branch tip into its own branch and rechecks affected behavior before reporting its commits, actual checks and unresolved acceptance gates.

5. Require the usual acceptance evidence from every implementer. For assessed tickets, also require the final verified model-gate receipt in the worker's native tool output; a self-reported model name is insufficient, and missing access to that evidence blocks acceptance. Unassessed tickets require no model-gate receipt. Merge its work to the integration branch with a **merger subagent**. A merger that changes code or resolves conflicts for an assessed ticket must bind its recommendation first; incompatible ticket settings require separate workers. Merges involving only unassessed tickets use existing settings without a gate. A blocked worker cannot make its dependents ready.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all ticket implementations have landed, run required checks on the integrated candidate and follow the loaded `code-review` skill against the task-start commit and full spec. Route accepted fixes to the affected ticket implementers, then validate and review their delta with affected callers. For assessed tickets, re-probe and rebind every resumed or replacement worker to the recommended pair; an unbound coordinator cannot implement those fixes. Unassessed tickets retain the ordinary fix workflow without model verification. Recheck assessment status on resume so newly recorded recommendations take effect.

8. Mark a draft PR ready or resolve tickets through the configured tracker only after all required checks, review fixes and acceptance gates pass. While a human response or other gate remains pending, preserve the draft and open tickets, report the implementation candidate and exact blocker, and follow the project's approval-request format.

9. Finish each active successful model gate, abort unfinished bindings, and remove temporary ticket snapshots. Remove only this run's worktrees after verifying their needed work is committed and retained on the integration branch or another recovery branch. Preserve unfinished work and report its location. Record expected and observed model/effort and any mismatches for assessed tickets; report unassessed tickets without inventing recommendations or verification receipts.
