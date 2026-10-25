## What it does

`ask-matt` is the router over the skills in this repo. You describe the situation you are in (an idea you cannot start, a pile of incoming bug reports, a [session](https://www.aihero.dev/ai-coding-dictionary/session) that has run long), and it names the skill or the sequence of skills that fits, plus where the human decisions in that sequence sit.

It verifies the relevant skill's instructions as reference material, recommends the next step, and stops. It does not grill, write a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) or fire the skill it just named; what you get back is the next thing to type, and you type it. It is also a hand-written map of the skills this plugin ships rather than a scan of what you have installed, so it will not route you over your own skills or another author's.

Implementation connects the ordinary entry early, retains settled decisions
and test boundaries, and reviews committed integrated candidates. Accepted
fixes receive delta review with affected callers. A handoff or compaction
preserves the authorized objective and all remaining requirements.

Repeated costly verification failures route through the shared preparation and diagnosis rules used by implementation and debugging. Retro maps supported workflow lessons to the existing skill that owns them and proposes an evaluation.

## When to reach for it

You invoke this by typing `/ask-matt`; the agent won't reach for it on its own.

| Your situation | What the router gives back |
| --- | --- |
| An idea, and no idea where to start | The head of the main flow, and whether the build is small enough to skip the spec |
| Bugs and requests arriving from other people | The [triage](https://aihero.dev/skills-triage) on-ramp, and why [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) you generated yourself don't belong on it |
| Two skills that look interchangeable | The line between them, and it is usually one concrete test rather than a matter of taste. [grill-me](https://aihero.dev/skills-grill-me) or [grill-with-docs](https://aihero.dev/skills-grill-with-docs) turns on whether you are in a working directory; [grill-with-docs](https://aihero.dev/skills-grill-with-docs) or [wayfinder](https://aihero.dev/skills-wayfinder) turns on whether the effort fits one session |
| A long session and a decision about the [context](https://www.aihero.dev/ai-coding-dictionary/context) | The ordered tree over the five options at a phase boundary |
| A skill you have already picked | Nothing useful. Invoke that skill directly. |

For a known failure, the debugging route starts with an existing check. The full
diagnostic loop is for unresolved causes; feature delivery does not automatically
expand into shared verification-tool development.

## Prerequisites

The router names skills; it does not install them. It checks `.claude-plugin/plugin.json`, the authority on what this plugin ships, before calling a skill missing. Parallel implementation also requires [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent) and isolated worktrees.

The tracker-dependent routes (triage, `to-spec`, `to-tickets`, `implement`) assume [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) has already configured an issue tracker in the repo. The router recommends them even before that has happened.

## Flows, not skills

The skill's leading word is **flow**, a path *through* the skills rather than a single skill. When you name your situation, the router places you at a step on a flow. That is a different answer from "here is the skill that matches your keywords". There are five kinds of route, and the skill itself describes them in full:

- **The main flow**, idea to ship. Grill, spec, tickets, implement (one ticket at a time, or the whole task graph in parallel with [implement-spec](https://aihero.dev/skills-implement-spec)), review, then [retro](https://aihero.dev/skills-retro), which proposes environment changes after the build. It has two branches. One is a prototype detour, for when a question needs runnable code to settle it. The other is the spec-and-tickets split, which is only worth its cost when the build spans more than one session. Small unpublished plans can go directly to implementation; a published spec goes through ticket splitting.
- **On-ramps**, for a situation that generates work and then merges onto the main flow: incoming bug reports, something broken, or an effort too foggy and too large to hold in one session.
- **Codebase health**, upkeep rather than feature work. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) surveys the code for deepening opportunities, and each one it finds re-enters the main flow as an idea.
- **Standalones**, which sit off every flow and which you use on their own: the prototype, the questionnaire, the research run.
- **A vocabulary layer underneath**, the two references the other skills pull in when the words rather than the process are the problem.

A visual parity action adds a manifest to the route. The source must require a
production surface to be compared against a visual reference, require
selecting that reference for the later comparison, or link an existing manifest
that records either obligation. UI work without that obligation stays on the
normal flow. For an applicable action, the manifest
travels through spec, tickets, implementation, and review.
The flow pauses after each production comparison; only your approval of the
exact candidate hash unlocks baseline promotion and the next surface.
The implementation turn must ask you directly with the validator-generated
`Approve` or `Reject` prompt; an unasked approval is a blocked delivery gate.

## The phase boundary

The skill's other key idea is the **phase boundary**. A phase is a chunk of work inside a session (the [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), the implementation, the QA), and the boundary between two of them is the natural point for a manual context decision. Mid-phase, continue or split what is left into [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent). Automatic compaction can happen mid-phase and must preserve the objective, decisions, authorization and remaining requirements.

| Option | Take it when |
| --- | --- |
| **Continue** | The next phase wants this one verbatim, or you have [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) left. It is the only move that keeps the session as a [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source), so rule it out first |
| **`/clear`** | Everything behind you is disposable. The cheapest option, and you cannot undo it if you were wrong |
| **[handoff](https://aihero.dev/skills-handoff)** | Something has to travel: a new [harness](https://www.aihero.dev/ai-coding-dictionary/harness), a new directory, a colleague, a side task forked mid-phase |
| **Subagent** | The task is scoped tightly enough to run with you [away from the keyboard](https://www.aihero.dev/ai-coding-dictionary/afk) |
| **`/compact`** | None of the above. It is the default, and the tree often ends here |

The usable context budget depends on the model and runtime.

People often get two of these wrong, which is why the router gives the order and not only the list. `/handoff` looks like the general way to move between context windows, but it is not. All it gives you is portability. `/compact` is the last option in the tree, not the first, because each of the four options above it is cheaper or more precise.

## Common questions

**Isn't there just a list of the skills in the right order?**

People keep asking for one in the README. This skill is that list. A static table would say `wayfinder → to-spec → to-tickets → implement → code-review → retro` and be wrong for most situations. The important parts are the branches: is there a codebase, does the build span sessions, can talking settle this question. The cost is that the router is maintained by hand, so it lags behind the repo. `/grilling` shipped long before the router named it.

**It told me half the skills aren't installed.**

Most of the skills the router routes you through set `disable-model-invocation: true`, which means the harness leaves them out of the skill list it injects into the agent's context. In one reported session, the agent read that list as exhaustive, declared the whole spec-and-tickets flow absent and rerouted to bare `/grilling` and `/tdd`. The router now checks `.claude-plugin/plugin.json`, the authority on what is present, before calling a skill missing. They are installed: type the slash command anyway.

**It described a skill's behaviour, and the skill doesn't do that.**

The router now requires reading the relevant `SKILL.md` as reference before describing or skipping its requirements. The skill's own instructions take precedence over this map's summary. Reading to verify a recommendation does not invoke a user-invoked workflow. Questions the map does not cover at all, such as whether to use [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode), get the [model](https://www.aihero.dev/ai-coding-dictionary/model)'s inference, not something written down here.

**Why is it prose instead of a numbered checklist?**

It is a fair complaint. An open issue argues that most of the routing is deterministic and that the narrative makes it hard to scan. Nothing stops you asking for the compressed form: "just give me the sequence" gets you the sequence. The prose carries the conditional part: the branches, where a human decision is expected, and where to clear or compact between steps. A flat checklist drops exactly that.

**Can it route over my own skills, or another author's?**

No. Three separate proposals have asked for a router that reads your local `skills/` directory and recommends from whatever is installed. `ask-matt` is not that. It is a map of one set, maintained by hand, and it knows nothing about skills you wrote or installed from elsewhere.

**It told me to edit a SKILL.md.**

That advice is often correct, but the edit rarely lasts. Someone asked it how to make [implement](https://aihero.dev/skills-implement) close tickets, was told to add a line to the skill, and saw the problem at once. `npx skills update` overwrites the file, and the plugin install is read-only. Put standing behaviour in your own `CLAUDE.md` or `AGENTS.md`, or say it in the invocation. Changes you make in the prompt survive updates. People point the flow at Linear instead of GitHub this way, or ask it which open tickets could run in parallel.

**It named a skill I don't have, or missed one I do.**

Check the changelog for a rename before assuming it is gone. `writing-great-skills` became [writing-for-agents](https://aihero.dev/skills-writing-for-agents) with no alias, `to-prd` became [to-spec](https://aihero.dev/skills-to-spec), and `pathfinder` became [wayfinder](https://aihero.dev/skills-wayfinder). Four skills were retired outright into the skills that absorbed them: `ubiquitous-language`, `design-an-interface`, `qa` and `request-refactor-plan`. If it misses a skill you have, check `.claude-plugin/plugin.json` before assuming it is absent.

## It's working if

- It ends by naming what to type and stops there, instead of starting the work itself.
- The route it gives back mentions where to clear or compact context and where you are expected to review, not just a list of skill names.
- Where two skills are close, it says which one and why the other is wrong for you.
- Any claim it makes about another skill's behaviour shows up in the trace as it reading that skill's `SKILL.md`.
- You recognise your own situation in what it hands back, rather than the nearest generic scenario.

## Where it fits

`ask-matt` is a **standalone router** that sits over the whole set. It is never a step in a chain. It points into every chain, and the other docs pages link back to it so none of them has to redraw the graph. From here you most often land on [grill-with-docs](https://aihero.dev/skills-grill-with-docs), the head of the main flow, or [triage](https://aihero.dev/skills-triage), the on-ramp for work that arrived rather than work you started.

It is a [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source) over the skills it describes. Where the router and a `SKILL.md` disagree, the `SKILL.md` is right.
