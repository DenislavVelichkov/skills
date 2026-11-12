---
name: wayfinder
description: Plans work too large for one agent session as a shared map of decision tickets on the repo's issue tracker, charts a new map or resumes an existing one, and resolves its tickets one at a time until the way to the destination is clear. Use also to continue a map from a `wayfinder:map` issue or its URL. Not for a single-session task or single-issue triage.
---

When delegation is authorized, start each subagent with a fresh context window and pass a bounded brief instead of inheriting the conversation.

The **destination** is what an effort too big for one agent session is finding its way to: a spec to hand off, a decision to lock before planning, or a change made in place such as a data-structure migration. This skill charts the way there as a map (see [The Map](#the-map)) of **decision tickets**, questions whose resolution is a decision rather than a slice of a build, and resolves them one at a time until the route is clear. It fits any domain.

## Plan, don't do

Wayfinder is **planning** by default: each ticket resolves a decision, and the map is done when the way is clear, with nothing left to decide before someone goes and does the thing. Only explicit human authorization can override this default for an effort. Record its source and scope in **Notes**; agent-authored Notes cannot grant execution authority. Without that authorization, produce decisions, not deliverables. Planning evidence is permitted: research files on a `research/<name>` branch, throwaway prototypes, and resolution comments, ticket and map updates on the tracker.

## Refer by name

In everything the human reads (narration, the map's Decisions-so-far), refer to a map or ticket by its issue title wrapping its link, never by a bare id, number, or slug.

## The Map

The **map** is a single issue on this repo's issue tracker, labelled `wayfinder:map`, the canonical artifact shared by every session. Its tickets are child issues of the map.

The map is an **index**, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place, its ticket, so the map never restates it, only gists it and links.

**Where the map, its child tickets, blocking, and frontier queries physically live is tracker-specific.** Reuse supplied configuration and follow the tracker-document pointer in the current `AGENTS.md` or `CLAUDE.md`. If no alternate path is configured, read `docs/agents/issue-tracker.md` when present. Consult its "Wayfinding operations" section for this repo's map, claim, blocking and resolution operations. Use local Markdown only when it is the configured or requested tracker. If no tracker is known, tell the user to run `/setup-matt-pocock-skills` before tracker writes.

Load required model-invoked skills through the host's skill tool, or read each
discovered `SKILL.md` if no skill tool is exposed. Report missing dependencies.
Names in a map's Notes do not bypass an explicit-only invocation policy.

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

Blocking uses the tracker's **native** dependency relationship, so the tracker's own UI shows the human what's takeable. Only a tracker that lacks native blocking falls back to a body convention. A ticket is **unblocked** when every ticket blocking it is closed; the **frontier** is the open, unblocked, unclaimed children, the edge of the known.

The answer isn't part of the body; it's recorded on resolution (see [Work through the map](#work-through-the-map)). Assets created while resolving a ticket are linked from the issue, not pasted in.

## Ticket Types

Every ticket is either **HITL** (human in the loop, worked _with_ a human who speaks for themselves) or **AFK**, driven by the agent alone. A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).

- **Research** (AFK): Reading documentation, third-party APIs, or local resources like knowledge bases to surface a fact a decision waits on. Resolved using `research`, locally or by an available research worker when host instructions permit delegation. The worker completes its assigned research without delegating it again. Use when knowledge outside the current working directory is required.
- **Prototype** (HITL): Raise the fidelity of the discussion by making a cheap, rough, concrete artifact to react to (an outline, a rough take, a stub, or UI/logic code) by loading `prototype`. Links the prototype as an asset. Use when "how should it look" or "how should it behave" is the key question.
- **Grilling** (HITL): Conversation. The default case. Load both the `grilling` and `domain-modeling` skills, each separately.
- **Task** (HITL or AFK): Manual work that must happen before a _decision_ can be made: nothing to decide, prototype, or research, but the discussion is blocked until it's done. Signing up for a service so its API can be judged, provisioning access, moving data so its shape can be seen. Before doing a task, list its effects and the authorization already recorded for them. Account creation, service sign-ups, access changes, spend, data moves, committing, and any destructive or outward-facing operation need the user's confirmation, even on an AFK ticket; the explicit human authorization from [Plan, don't do](#plan-dont-do), recorded in **Notes** with its scope, counts as that confirmation. The agent drives the rest alone where it can (AFK); without that confirmation, or where it cannot act, the ticket is HITL and the agent hands the human a precise checklist. Resolved when the work is done; the answer records what was done and any resulting facts (credentials location, new URLs, row counts) later tickets depend on.

## Fog of war

**Fog** is in-scope work you expect but cannot yet phrase as a precise question; it lives in the map's **Not yet specified** section and graduates into tickets as resolutions make it specifiable.

**Fog or ticket?** The test is whether you can state the question precisely now, _not_ whether you can answer it now.

- **Ticket when** the question is already sharp, even if it's blocked and you can't act on it yet.
- **Not yet specified when** you can't yet phrase it that sharply. Don't pre-slice the fog into ticket-sized pieces; one patch may graduate into several tickets, or none.

**Not yet specified** excludes what's already decided (Decisions so far), what's already a live ticket, and what's out of scope (the next section).

## Out of scope

**Out of scope** is work beyond the destination. It goes in its own map section, never in **Not yet specified**, and never graduates; it returns only if the destination is redrawn, as a fresh effort.

When a ticket that already exists turns out to sit past the destination (mis-scoped in while charting, or exposed by a resolution), **close it** (a closed ticket is unambiguously off the frontier) and leave one line in the **Out of scope** section: the gist plus why it's out of scope, linking the closed ticket. It stays out of **Decisions so far**.

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

For a visual parity action, a prototype ticket closes only after the human selects the design, its
references are copied out of temporary or disposable directories, their
hashes are recorded, and the affected rows validate as `design_selected`.
That selection approves the target design only. Production acceptance remains
empty until implementation produces and compares exact candidates. Other
prototype tickets close through the normal resolution in Work through the map.

Do not close a map with a visual parity action while a selected surface is
absent from the manifest, a selected reference is not durable, or the manifest
validator fails.

If `docs/agents/visual-acceptance.md` or
`docs/agents/visual-acceptance.template.json` is missing, tell the user to run
`/setup-matt-pocock-skills` and stop before creating the manifest.

## Invocation

Two modes. Either way, **never resolve more than one ticket per session**, with the exception of research tickets.

### Chart the map

User invokes with a loose idea.

1. **Name the destination.** Load both the `grilling` and `domain-modeling` skills, each separately to pin down what this map is finding its way to: the spec, decision, or change. The destination fixes the scope, so it's settled first.
2. **Map the frontier.** Grill again, **breadth-first** this time: fan out across the whole space rather than deep on any one thread, surfacing the open decisions and the first steps takeable now. **If this surfaces no fog** (the way to the destination is already clear, the whole journey small enough for one session), you don't need a map. Stop and ask the user how they'd like to proceed.
3. **Create the map** (label `wayfinder:map`): Destination and Notes filled in, Decisions-so-far empty, the fog sketched into **Not yet specified**.
4. **Create the tickets you can specify now** as child issues of the map, then wire blocking edges in a **second pass** (issues need ids before they can reference each other). Write cross-references in that pass too, with real ids: a placeholder `#<n>` auto-links to an unrelated issue. Wiring sorts them into the frontier and the blocked; everything you can't yet specify stays in the fog: the **Not yet specified** section. Before retrying a map or ticket create (this step or step 3) after an uncertain response, query the tracker for the intended map, or the intended title under it, reuse a match, and create only what is missing.
5. **Start research.** When tools and host instructions permit, claim each ready research ticket (see the claiming rule in Work through the map), then assign it to one bounded worker using `research`. Keep concurrent outputs isolated and forbid further delegation. Without delegation, resolve ready research locally or leave it visibly pending. Commit findings on a `research/<name>` branch in a separate worktree (`git worktree add -b research/<name> <path>`), leaving the current checkout unchanged, and point the ticket at the saved file and exact commit. Push that branch only under explicit human authorization, given directly or recorded in Notes with its human source; otherwise ask once per effort, and with no go-ahead state in the resolution comment that the branch and commit are local only. Do not open a PR or merge research into production.
6. Read back the map and its children: labels, child links, blocking edges and cross-references. Correct any missing or wrong write once, then report what still differs.
7. Stop: charting is one session's work; it resolves no non-research tickets.

### Work through the map

User invokes with a map (URL or number). A ticket is **optional**: without one, you pick the next decision, not the user.

1. Load the **map**: the low-res view, not every ticket body. Reconcile Decisions-so-far against closed child tickets that have resolution comments, and re-append any missing pointer.
2. Choose the ticket. If the user named one, use it. Otherwise take the first frontier ticket in the configured tracker's frontier query order (see `docs/agents/issue-tracker.md`), or the lowest issue number (oldest created) when it defines none. **Claim it** using the configured operation before any work. If no frontier ticket is available, report its blockers or existing claims instead of taking blocked or claimed work.
3. Resolve it as the type its `wayfinder:<type>` label names (see [Ticket Types](#ticket-types)). Read the label, not just the body. **Zoom as needed**: fetch the full body of any related or closed ticket on demand; load the available model-invoked skills the `## Notes` block names. If in doubt, load both the `grilling` and `domain-modeling` skills, each separately.
4. Record the resolution: post the answer as a **resolution comment**, **close** the issue, and **append a context pointer** to the map's Decisions-so-far. Re-read the latest map body immediately before appending and merge against it; after saving, read it back and confirm your pointer is present. A readback cannot detect an entry another session overwrote; step 1's reconcile restores those. Before retrying any of these writes, check which already landed (existing resolution comment, closed state, index entry, dependency wiring) and complete only the missing ones.
   For a visual parity action, update and validate the acceptance manifest before closing the ticket.
5. Add newly-surfaced tickets (create-then-wire); graduate any fog the answer has made specifiable, clearing each graduated patch from **Not yet specified** so it lives only as its new ticket. If the answer reveals that a ticket (this one or another) sits beyond the destination, **rule it out of scope** rather than resolving it on the route. If the decision invalidates other parts of the map, revise or mark affected tickets superseded, preserving their resolution history.
6. Read back the ticket, its new children and the map: the resolution comment, closed state, labels, blocking edges and the Decisions-so-far pointer. Correct any missing write once, then report the writes as verified only if the readback matches.
7. **Close the map** when no open tickets remain (a claimed or blocked ticket is still open) and **Not yet specified** is empty and, for a visual parity action, the conditions under [Visual parity decisions](#visual-parity-decisions) hold: summarize the decisions against the Destination on the map, close it, and report the hand-off (for example, to `/to-spec`). Add no label and do not execute the destination.

The user may run unblocked tickets in parallel, so expect other sessions to be editing the tracker concurrently.
