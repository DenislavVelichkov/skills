---
name: ask-matt
description: Recommends the next skill or flow for the user's situation and does not run it. A router over the skills in this repo.
disable-model-invocation: true
---

# Ask Matt

Recommend the next skill or flow and stop; this router does not execute it.
Reply with: the recommended skill or flow, a one-line reason, the result of the
availability and precondition check, and one alternative when the situation is
ambiguous. If nothing fits, say so and suggest proceeding without a skill; name
the closest skill and what it does not cover only when one is near enough to help.
Before recommending, check the loaded plugin's selection and the relevant
`SKILL.md` as reference material: the summaries here are for orientation only.
In this Claude plugin, `.claude-plugin/plugin.json` lists the selected skills. A
user-invoked skill can be installed while absent from the skill list the agent
sees; check the manifest before calling it missing. Report unavailable steps and
use an available route. Reading a skill to verify its behavior does not
authorize executing it.

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

Both implementation routes select the next authorized action after each batch.
For visual parity, worker briefs and integration follow the owning
[visual sequence](../implement/VISUAL-PARITY.md) for early comparison and exact
human approval. That sequence includes numbered difference pointers through the
project comparison producer. A ticket graph does not authorize parallel implementation or
override an approved serial acceptance order.

The route most work travels. You have an idea and want it built.

1. **`/grill-with-docs`** sharpens the idea by interview. Start here whenever you are **working in a working directory**: it's stateful, retaining what it learns in `GLOSSARY.md` and ADRs. (No working directory? Use `/grill-me` instead, covered under Standalone. Both run the same `/grilling` primitive; `grill-with-docs` is the one that leaves a paper trail, which makes it the better of the two whenever a repo is there to leave it in.)
2. **Branch: can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for; see Phase boundaries):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch: is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. A local spec at `.scratch/<feature>/spec.md` gets a fresh implementation set under `.scratch/<feature>/implementation/issues/`. The spec is not executable work. Then work the tickets one of two ways:
     - **`/implement`** per ticket, blockers first, deciding context between tickets with [Phase boundaries](#phase-boundaries); preserve settled decisions, authorization and remaining requirements before any clear.
     - **`/implement-spec`** for the whole spec in one run, only when the host supports the required subagents and isolated worktrees.
   - **No, and the small plan is still unpublished** → **`/implement`** right here. A published spec always goes through **`/to-tickets`** first.

   Model selection rules live in [model execution verification](../implement/MODEL-EXECUTION.md).

   Both implementation paths use **`/tdd`** and **`/code-review`**. Use `/tdd` directly for a concrete behavior to build test-first, or `/code-review` to assess a branch or PR against a fixed point.

   If the source requires a visual reference comparison, carry its visual parity manifest through `/to-spec` and `/to-tickets`.

   When the work goes up as a pull request, the agent reaches for the model-invoked **`/pr`**, which shapes the body with a small visual, before/after evidence and a merge-danger call.

4. **`/retro`** reviews the completed session and proposes changes to the agent's environment. Workflow lessons name their existing skill owner, overlapping guidance and an observable evaluation; it recommends automated checks for mechanical mistakes and coding standards for judgement calls. It stops after presenting the recommendations unless the user has authorized their implementation.

### Context hygiene

Keep steps 1–3 together while the host can retain the relevant context. Before
manual clearing or compaction, preserve decisions, authorization and remaining
requirements in the existing artifacts. Automatic compaction does not end the
objective. Each `/implement` can start from its exact ticket and linked decisions.
Use only context commands supported by the current host. The usable context
budget depends on the model and runtime, not a universal token threshold.

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create**: bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It starts with the error, owning code and smallest existing check. A clear cause gets a direct fix; uncertain failures use a **tight feedback loop** that exposes the actual bug. Shared-tooling repairs follow the bounded scope in [proportionate verification](../implement/VERIFICATION.md). Once the fix is in, recommend **`/retro`** to examine what would have prevented the bug. If there is no suitable seam for a regression test, recommend **`/improve-codebase-architecture`**.

  For an inconclusive resumed diagnosis, keep its existing trial budget and
  missing-evidence decision. Recommend the next discriminating action only when
  that budget and authorization permit it; do not restart the diagnosis flow.

- **A huge, foggy effort: a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**. It charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time, producing **decisions, not deliverables**. Use **`/grill-with-docs`** instead for an idea that fits one session; never use wayfinder for a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. `/implement` must not build directly from the map or parent spec.

For GitHub triage, pure spec/group containers stay outside execution triage;
actionable parents remain eligible. Generated agent-ready children need no
retriage while blocked. The configured tracker owns those rules.

## Codebase health

Not feature work, just upkeep.

- **`/improve-codebase-architecture`** runs whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities**; picking one _generates an idea_ you can take into the main flow at `/grill-with-docs`. It's the survey that finds the candidates; **`/codebase-design`** (below) is the bench you design the chosen one on.

## Vocabulary underneath

Two model-invoked references that run _beneath_ the other skills, each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`/domain-modeling`**: sharpen the project's _domain_ language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `/grill-with-docs` drives to keep `GLOSSARY.md` a clean glossary.
- **`/codebase-design`** is the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's _shape_: a lot of behaviour behind a small interface at a clean seam. `/tdd` and `/improve-codebase-architecture` both speak it.

## Phase boundaries

A **phase** is a chunk of work inside a session: the grilling, the implementation, the QA. At the **boundary** between two of them the options are Continue, `/clear`, `/handoff`, a subagent, or `/compact`.

At a phase boundary, read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered tree: the five questions, the reasoning behind each branch, and why the primary-source cost makes **Continue** the one to rule out first. Make a manual context decision **at** a boundary; mid-phase, continue or split the rest into subagents. Preserve the work across any automatic compaction.

## Standalone

Off the main flow entirely.

| Situation                                                                                                                  | Skill                 |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Long-running goal that needs background subagents and durable, commit-cited memory (in-progress; only the user invokes it) | `/chief-of-staff`     |
| Interview with no working directory (a plan, a design, a piece of writing)                                                 | `/grill-me`           |
| The bare interview, with no wrapper                                                                                        | `/grilling`           |
| A design question that needs runnable, throwaway code                                                                      | `/prototype`          |
| Reading legwork against primary sources, delegated to a background agent                                                   | `/research`           |
| The blocker is in someone else's head; write them a questionnaire                                                          | `/to-questionnaire`   |
| Steps only a human can take (infrastructure, credentials, dashboards, cutovers)                                            | `/wizard`             |
| A message that didn't land; re-pitch it with the missing context                                                           | `/wait-what`          |
| Learn a concept over multiple sessions                                                                                     | `/teach`              |
| Writing skills, AGENTS.md or other documents agents consume                                                                | `/writing-for-agents` |

## Precondition

**`/setup-matt-pocock-skills`**: run before your first engineering flow to configure
the issue tracker, triage labels, domain docs and local verification. Rerun to
adopt missing setup conventions while preserving existing choices. It reuses
repository tools for commit checks and applicable review/evidence guidance;
a local-only choice does not require hosted CI/CD. Custom issue trackers work.
