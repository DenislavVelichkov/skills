---
name: ask-matt
description: Recommends which Matt Pocock skill or flow fits the user's situation, routing over this plugin's skill catalog without executing the recommended skill. Use when the user asks which skill to use next or how the skills fit together.
---

# Ask Matt

You don't remember every skill, so ask.

Recommend the next skill or flow and stop; this router does not execute it.
Before recommending, read the candidate's `SKILL.md` as reference material, through
the host's skill tool or the path where the host discovered it (usually
`../<skill>/SKILL.md` for skills in this plugin; a separately installed skill lives elsewhere).
Reading a skill to verify its behavior does not authorize executing it.

- In this Codex plugin, the root `.codex-plugin/plugin.json` determines which
  skills are exposed. Check a skill's registration there before calling it missing.
- An explicit-only skill can be registered yet absent from implicit discovery.
  Recommend that the user invoke it by name.
- A skill missing from that selection is unavailable unless the user installed it
  separately. Say so and offer the nearest available route.

Reply with the recommended skill or flow, one sentence on why, and any
prerequisite or unavailable step. If nothing fits, say so and suggest proceeding without a skill.

The map below picks the skill. When the user asks how a flow runs past that pick (its branches, tracker layout, verification rules, or what each skill hands to the next), read [FLOWS.md](FLOWS.md).

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

Both implementation routes select the next authorized action after each batch.
For visual parity, worker briefs and integration follow the owning
[visual sequence](../implement/VISUAL-PARITY.md) for early comparison and exact
human approval. That sequence includes numbered difference pointers through the
project comparison producer. A ticket graph does not authorize parallel implementation or
override an approved serial acceptance order.

1. **`/grill-with-docs`** sharpens the idea by interview when there is a repository or an agreed documentation workspace it may write to. Neither? **`/grill-me`**.
2. A question that needs a runnable answer (state, business logic, a UI you have to see): **`/handoff`** out, **`/prototype`**, **`/handoff`** back.
3. A multi-session build: **`/to-spec`**, then **`/to-tickets`**, then either **`/implement`** per ticket (by default `/clear` between tickets; decide at each boundary with Phase boundaries below) or **`/implement-spec`** for the whole spec when the host supports the required subagents and isolated worktrees. Work that fits one session with no published spec: **`/implement`** directly; a published spec always goes through `/to-tickets` first. Both paths use **`/tdd`** and **`/code-review`**; **`/pr`** shapes a pull request body.
4. **`/retro`** reviews the completed session and proposes environment changes. It stops after presenting the recommendations unless the user has authorized their implementation.

## On-ramps

- **Bugs and requests piling up** → **`/triage`**, only for issues **you didn't create**. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.
- **Something's broken** → **`/diagnosing-bugs`**, then **`/retro`** once the fix is in; **`/improve-codebase-architecture`** if there is no seam for a regression test.
- **A huge, foggy effort too big for one session** → **`/wayfinder`**, never a well-scoped feature. When the map clears **it hands off, it doesn't build**: merge onto the main flow at `/to-spec`. `/implement` must not build directly from the map or parent spec.

## Codebase health and vocabulary

- **`/improve-codebase-architecture`**: upkeep survey for deepening opportunities; a pick enters the main flow at `/grill-with-docs`.
- **`/domain-modeling`** (domain language, glossary, ADRs) and **`/codebase-design`** (deep-module vocabulary): model-invoked references, for when the **words**, not the process, are the problem.

## Phase boundaries

A **phase** is a chunk of work inside a session: the grilling, the implementation, the QA. At the **boundary** between two phases the options are Continue, `/clear`, `/handoff`, a subagent, or `/compact` (the default, at the bottom of the tree).

When the user asks what to do at a boundary, read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered tree and the reasoning behind each branch. Make a manual context decision **at** a boundary; preserve the work across any automatic compaction. Delegate only when the host permits it.

## Standalone

- **`/chief-of-staff`**: a long-running goal coordinated through background subagents and a durable wiki. It is selected in this Codex plugin but remains in-progress and explicit-only; only the user invokes it. Use `/implement-spec` for execution of one approved spec.
- **`/grill-me`**: the stateless interview with no repository or documentation workspace under it.
- **`/grilling`**: the bare interview primitive, with no wrapper.
- **`/prototype`**: throwaway code that answers one hard design question.
- **`/research`**: a cited Markdown file from primary sources on a scoped question.
- **`/to-questionnaire`**: a questionnaire for the person who holds the missing knowledge.
- **`/wizard`**: an interactive script for steps only a **human** can take. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`**: re-pitches a message that didn't land.
- **`/teach`**: learn a concept over multiple sessions.
- **`/writing-for-agents`**: the reference for writing documents agents consume.

## Precondition

**`/setup-matt-pocock-skills`**: run before your first engineering flow to configure
the issue tracker, triage labels, domain docs and local verification. Rerun to
adopt missing setup conventions while preserving existing choices. Custom issue trackers work.
