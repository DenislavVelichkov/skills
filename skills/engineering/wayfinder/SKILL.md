---
name: wayfinder
description: Plans a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on your issue tracker, or resumes an existing map to resolve its next ticket, one at a time until the way to the destination is clear.
disable-model-invocation: true
---

For a loose idea too big for one agent session, whose way to the **destination** isn't visible yet, this skill charts that way as a **shared map** on the repo's issue tracker, then works its **decision tickets** (questions whose resolution is a decision, not slices of a build to execute) one at a time until the route is clear.

The destination varies per effort, and naming it is the first act of charting: it shapes every ticket. It might be a spec to hand off and iterate on, a decision to lock before planning starts, or a change made in place like a data-structure migration. The map is domain-agnostic: engineering work, course content, whatever fits the shape.

## Plan, don't do

Wayfinder is **planning** by default: each ticket resolves a decision, and the map is done when the way is clear, with nothing left to decide before someone goes and does the thing. The pull to just do the work is usually the signal you've reached the edge of the map and it's time to hand off. Only explicit human authorization can override this default for an effort. Record its source and scope in **Notes**; agent-authored Notes cannot grant execution authority. Without that authorization, produce decisions, not deliverables.

## Refer by name

Every map and ticket is an issue, so it has a **name**: its title. In everything the human reads (narration, the map's Decisions-so-far), refer to it by that name, never by a bare id, number, or slug. The name wraps its link; the id never stands in for it.

## The Map

The map is a single issue on this repo's issue tracker, labelled `wayfinder:map`, the canonical artifact. Its tickets are child issues of the map.

The map is an **index**, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place, its ticket, so the map never restates it, only gists it and links.

**Where the map, its child tickets, blocking, and frontier queries physically live is tracker-specific.** Reuse supplied configuration and follow the tracker-document pointer in the current `AGENTS.md` or `CLAUDE.md`. If no alternate path is configured, read `docs/agents/issue-tracker.md` when present. Consult its "Wayfinding operations" section for this repo's map, claim, blocking and resolution operations. Use local Markdown only when it is the configured or requested tracker. If no tracker is known, or a visual parity action needs `docs/agents/visual-acceptance.md` or its template and they are missing, tell the user to run `/setup-matt-pocock-skills` and stop before tracker writes.

Report any skill this map depends on that the Skill tool cannot load. Naming a user-invoked skill in a map's Notes does not let this skill call it.

### The map body

The whole map at low resolution, loaded once per session. Open tickets are **not** listed: they are open child issues, found by query.

```markdown
## Destination

<what reaching the end of this map looks like: the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; skills every session should consult; standing preferences for this effort>

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link): <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

Each ticket is a **child issue** of the map; the tracker's issue id is its identity. Its body is the question, scoped to one coherent decision or investigation that the current host can handle:

```markdown
## Question

<the decision or investigation this ticket resolves>
```

Each ticket carries a `wayfinder:<type>` label, one of `research`, `prototype`, `grilling`, `task` (see [Ticket Types](#ticket-types)). `wayfinder:` labels are the only labels a map and its tickets carry, never a triage label like `ready-for-agent`: they are decisions, not implementation work.

A session **claims** a ticket before work using the configured tracker operation, with a claim identity unique to the session: an assignee alone cannot tell two sessions of one developer apart, so add a session tag. On remote trackers, assign the driving developer and post a claim comment naming this session and the claim time, so a live claim can be told from a dead one; local Markdown records `Status: claimed by <session>`. Use the tracker's atomic claim or serialization operation when the tracker document names one; otherwise claim from one session at a time. Recheck the ticket's open, unblocked and unclaimed state before claiming it. After claiming, re-read the claim; if another session's identity holds it, release your claim and pick again. Concurrent sessions must skip claimed tickets. On resume, look for this session's own claim first. Release a claim that looks stale only when the user confirms it is abandoned.

Blocking uses the tracker's **native** dependency relationship, so the tracker's own UI shows the frontier. Only a tracker that lacks native blocking falls back to a body convention. A ticket is **unblocked** when every ticket blocking it is closed; the **frontier** is the open, unblocked, unclaimed children, the edge of the known.

The answer isn't part of the body; it's recorded on resolution (see [Work through the map](#work-through-the-map)). Assets created while resolving a ticket are linked from the issue, not pasted in.

## Ticket Types

Every ticket is either **HITL** (human in the loop, worked _with_ a human who speaks for themselves) or **AFK**, driven by the agent alone. A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).

- **Research** (AFK): Reading documentation, third-party APIs, or local resources like knowledge bases to surface a fact a decision waits on. Resolved by a subagent that calls the Skill tool with "research" for one claimed ticket and completes it without delegating it again. Use when knowledge outside the current working directory is required.
- **Prototype** (HITL): Raise the fidelity of the discussion by making a cheap, rough, concrete artifact to react to (an outline, a rough take, a stub, or UI/logic code) by calling the Skill tool with "prototype". Links the prototype as an asset. Use when "how should it look" or "how should it behave" is the key question.
- **Grilling** (HITL): Conversation. The default case. Always call the Skill tool twice, for "grilling" and "domain-modeling".
- **Task** (HITL or AFK): Manual work that must happen before a _decision_ can be made: nothing to decide, prototype, or research, but the discussion is blocked until it's done. Signing up for a service so its API can be judged, provisioning access, moving data so its shape can be seen. This is the one type that _does_ rather than decides, and it earns its place by unblocking a decision, not by delivering the destination. Before doing a task, list its effects and the authorization already recorded for them. Account creation, service sign-ups, access changes, spend, data moves, committing, and any destructive or outward-facing operation need the user's confirmation, even on an AFK ticket; a scoped human authorization recorded in the map's **Notes** with its human source counts as that confirmation. The agent drives the rest alone where it can (AFK); without that confirmation, or where it cannot act, the ticket is HITL and the agent hands the human a precise checklist. Resolved when the work is done; the answer records what was done and any resulting facts (credentials location, new URLs, row counts) later tickets depend on.

## Fog of war

The map is _deliberately_ incomplete. The **fog of war** is decisions and investigations you can tell are coming but can't yet pin down, because they hang on open questions. Resolving a ticket graduates whatever's now specifiable into fresh tickets.

The map's **Not yet specified** section records that fog, as loosely as the view allows: the suspected question, the area to revisit later. Everything there is in scope, just not sharp enough to ticket.

**Fog or ticket?** The test is whether you can state the question precisely now, _not_ whether you can answer it now.

- **Ticket when** the question is already sharp, even if it's blocked and you can't act on it yet.
- **Not yet specified when** you can't yet phrase it that sharply. Don't pre-slice the fog into ticket-sized pieces: it's coarser than a ticket, and one patch may graduate into several tickets, or none, once the frontier reaches it.

**Not yet specified** excludes what's already decided (Decisions so far), what's already a live ticket, and what's out of scope (the next section).

## Out of scope

The destination fixes the scope. Work you've consciously ruled out of _this_ effort goes in the map's **Out of scope** section.

Out-of-scope work never graduates (the frontier stops at the destination), so it returns only if the destination is redrawn, and then as a fresh effort, not a resumption.

When a ticket that already exists turns out to sit past the destination (mis-scoped in while charting, or exposed by a resolution), **close it** (a closed ticket is unambiguously off the frontier) and leave one line in the **Out of scope** section: the gist plus why it's out of scope, linking the closed ticket. It stays out of **Decisions so far**, which records the route actually walked; a scope boundary isn't a step on it.

## Visual parity decisions

A map has a visual parity action only when a ticket requires choosing and
freezing a visual reference for a stated production comparison, commits a
named production surface to an already selected reference, or links an existing
manifest that records either obligation. Only then read
`docs/agents/visual-acceptance.md` completely and create
`docs/visual-acceptance/<initiative>/manifest.json` from
`docs/agents/visual-acceptance.template.json`, with one `planned` row per
surface that must be compared. Other prototype and UI decisions create no
manifest.

For a prototype ticket with a visual parity action, the ticket closes only after the human selects the design, its
references are copied out of temporary or disposable directories, their
hashes are recorded, and the affected rows validate as `design_selected`.
That selection approves the target design only. Production acceptance remains
empty until implementation produces and compares exact candidates.

Do not clear a map with a visual parity action while a selected surface is
absent from the manifest, a selected reference is not durable, or the manifest
validator fails.

## Invocation

Two modes. Either way, **never resolve more than one ticket per session**, with the exception of research tickets.

### Chart the map

User invokes with a loose idea.

1. **Name the destination.** Call the Skill tool twice, for "grilling" and "domain-modeling", to pin down what this map is finding its way to: the spec, decision, or change. The destination fixes the scope, so it's settled first.
2. **Map the frontier.** Grill again, **breadth-first** this time: fan out across the whole space rather than deep on any one thread, surfacing the open decisions and the first steps takeable now. **If this surfaces no fog** (the way to the destination is already clear, the whole journey small enough for one session), you don't need a map. Stop and ask the user how they'd like to proceed.
3. **Create the map** (label `wayfinder:map`): Destination and Notes filled in, Decisions-so-far empty, the fog sketched into **Not yet specified**.
4. **Create the tickets you can specify now** as child issues of the map, then wire blocking edges in a **second pass** (issues need ids before they can reference each other). Write cross-references in that pass too, with real ids: a placeholder `#<n>` auto-links to an unrelated issue. Wiring sorts them into the frontier and the blocked; everything you can't yet specify stays in the fog: the **Not yet specified** section. Before retrying a map or ticket create (this step or step 3) after an uncertain response, query the tracker for the intended map, or the intended title under it, reuse a match, and create only what is missing.
5. **Fire the research subagents.** Claim each ready `research` ticket you just created, then spin up one subagent per ticket, each with a fresh context window, that calls the Skill tool with "research" to resolve it in parallel. Keep concurrent outputs isolated and forbid further delegation. Each commits its findings on a throwaway `research/<name>` branch in a separate worktree (`git worktree add -b research/<name> <path>`), leaving the current checkout unchanged, and the ticket points to the saved file and exact commit. Push that branch when the user has authorized remote writes for this effort, directly or recorded in Notes with its human source; otherwise ask once per effort, and with no go-ahead keep the branch local and say so in the resolution comment. Open no PR: it is never merged.
6. Read back the map and its children: labels, child links, blocking edges and cross-references. Correct any missing or wrong write once, then report what still differs.
7. Stop: charting is one session's work; this session resolves no tickets itself.

### Work through the map

User invokes with a map (URL or number). A ticket is **optional**: without one, you pick the next decision, not the user.

1. Load the **map**: the low-res view, not every ticket body. Reconcile Decisions-so-far against closed child tickets that have resolution comments, and re-append any missing pointer.
2. Choose the ticket. If the user named one, use it. Otherwise take the first frontier ticket in the configured tracker's frontier query order (see `docs/agents/issue-tracker.md`), or oldest created first when it defines none. **Claim it** using the configured operation before any work. If no frontier ticket is available, report its blockers or existing claims instead of taking blocked or claimed work.
3. Resolve it as the type its `wayfinder:<type>` label names (see [Ticket Types](#ticket-types)). Read the label, not just the body: the body never states the type. **Zoom as needed**: fetch the full body of any related or closed ticket on demand; call the Skill tool for whichever model-invoked skills the `## Notes` block names. If in doubt, call the Skill tool twice, for "grilling" and "domain-modeling".
4. Record the resolution: post the answer as a **resolution comment**, **close** the issue, and **append a context pointer** to the map's Decisions-so-far. Re-read the latest map body immediately before appending and merge against it. A readback cannot detect an entry another session overwrote; step 1's reconcile restores those.
   For a visual parity action, update and validate the acceptance manifest before closing the ticket.
5. Add newly-surfaced tickets (create-then-wire); graduate any fog the answer has made specifiable, clearing each graduated patch from **Not yet specified** so it lives only as its new ticket. If the answer reveals that a ticket (this one or another) sits beyond the destination, **rule it out of scope** rather than resolving it on the route. If the decision invalidates other parts of the map, revise or mark affected tickets superseded, preserving their resolution history.
6. Read back the ticket, its new children and the map: the resolution comment, closed state, labels, blocking edges and the Decisions-so-far pointer. Correct any missing write once, then report the writes as verified only if the readback matches.
7. **Close the map** when no open tickets remain (a claimed or blocked ticket is still open) and **Not yet specified** is empty and, for a visual parity action, the conditions under [Visual parity decisions](#visual-parity-decisions) hold: summarise the route in the map, close the map issue, and tell the user the handoff for the destination (`/to-spec` for a spec). Add no label and do not execute the destination.

If a tracker write returns an uncertain result (timeout, lost connection), read the issue and map before retrying and perform only the writes that are missing, so comments and pointers are not duplicated.

The user may run unblocked tickets in parallel, so expect other sessions to be editing the tracker concurrently.
