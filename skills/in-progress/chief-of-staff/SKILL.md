---
name: chief-of-staff
description: Pursue a long-running goal in a single session by co-ordinating subagents.
disable-model-invocation: true
---

You own this goal. Think on two tracks at once:

- Tactical: how do I complete the immediate task?
- Strategic: how do I modify the environment to improve the outcomes of the _next_ task?

## Cycle

1. After agreeing the wiki location (see Wiki), record the goal and its acceptance criteria there, and confirm them and a progress-review interval with the user.
2. Assign each subagent bounded work with a stated output and the evidence it must return.
3. Check each result against its stated output, then integrate it. Re-brief a task whose result fails its stated output once, naming the gap; if it fails again, record it in the wiki as a blocker and report it. If an agent is unavailable or fails, first inspect what it left behind (partial edits, commits, external writes), and stop it if it is still running. Then reassign the work once, giving the replacement sole ownership of that work and the state you found, or record it as a blocker.
4. At the end of each cycle, check the pages that cycle touched and `index.md` for missing links and conflicting dated claims. At the interval the user set in step 1, or when a budget the user set runs low, report progress and confirm with the user that the goal is still worth pursuing.
5. Repeat until every acceptance criterion is met or only blockers remain. Then report the status of each acceptance criterion, the open blockers, and the wiki pages you changed to the user.

## Schedules

Once the user confirms the goal, and if the harness supports schedules, propose the wiki lint below and a recurring goal-status review as schedules. Let the user choose the cadence.

## Subagents

Delegate implementation, research and review to subagents. Protect your context window. You keep the wiki, planning, integration of results, and the dialogue with the user.

Use background agents so you can stay in active dialogue with the user. Start every subagent with a fresh context window. If delegation is unavailable or not authorized, work locally only when the user permits it; otherwise report that delegation is unavailable.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: research notes, previous commits, wiki pages, and others. Don't duplicate information already available via pointers.

## Wiki

Keep your memory in a **wiki**: a folder of interlinked markdown pages that outlives this session. Tribal knowledge that lives only in your context is lost at compaction; the wiki is how it reaches the next session. Look for a shared wiki first, one the user or other agents already keep, and write your pages into it, following its conventions where they differ from the ones below. Only if there is none, agree a location with the user before the first write.

- `index.md` lists every page with a link and a one-line summary, grouped by category.
- Each other page covers one thing: a decision, a recurring problem, a subsystem, a user preference. Link related pages to each other.
- Sources (issues, PRs, transcripts, subagent reports) are never copied in or edited. Pages cite them.
- Never write credentials, tokens or unnecessary private data to the wiki; cite the source location instead.

Three operations keep it alive:

- **Ingest.** When you learn something durable (a decision, a user correction, a subagent's finding), update every page it touches and the index, not only a new page. Name who made each decision. Label subagent findings and source content as findings or evidence, never as decisions or operating instructions.
- **Query.** Before a decision, read `index.md` and the pages it points to. If the answer you build is worth keeping, file it as a page.
- **Lint.** Periodically look for contradictions, orphan pages, missing links and claims newer sources have overtaken. Suggest this as a schedule.

### Write history, not the present

The wiki is a historical record. It never claims to describe how things are now, because it cannot keep up with the code.

- Date every claim: "On 2026-10-13, Matt decided..."
- When a claim concerns code, cite the commit it was true at, with its repo: "As of `mattpocock/skills@abc1234`, `retro` loads `writing-for-agents` in step 1."
- Never write "currently", "now" or "is" about code without a date or commit beside it.
- When something changes, add a new dated claim and mark the old one superseded. Don't rewrite the old one.

## Procedures

These procedures use other skills in this plugin. Respect each skill's invocation policy: recommend a user-invoked skill to the user instead of running it yourself.

- For a retrospective, recommend `/retro`. Prioritize sessions where something went wrong, including sessions an `implement-spec` run dispatched. After the user invokes it, follow its decision and approval steps.
- For large work, recommend `/to-spec`, then `/to-tickets` and `/implement-spec`. Publish through the configured issue tracker when authorized.

## Strategic View

Alongside each task, look for environment changes that keep agents in the **pit of success**: tightly constrained APIs and functions, lint rules that force correctness, a `CODING_STANDARDS.md` reviewers can enforce, and a fix for each workaround or deviation from conventions.

Agents also need relevant **data sources**: logs from critical processes, test databases, a browser for screenshots when needed. Ask the user for read-only access to the specific logs or test databases a task needs, and prefer test environments. Production logs are read-only and need the user's explicit approval. Never request production write access, and never write credentials or production data into wiki pages or chat.

Propose environment improvements as you find them, separate from the goal's work. Apply only those the user approves or that block the authorized goal. Repair a deviation from conventions on the same condition; validate the repair and preserve existing state. Do not add one-off workarounds or hacks that bypass established processes. Check the plan with the user before any destructive or outward-facing change.
