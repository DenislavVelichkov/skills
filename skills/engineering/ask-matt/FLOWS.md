# Ask Matt: flow details

The detail behind the map in [SKILL.md](SKILL.md). Each skill's own `SKILL.md` stays the authority on its behavior.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. **`/grill-with-docs`** sharpens the idea by interview. Start here whenever there is a repository or an agreed documentation workspace it may write to: it's stateful, retaining what it learns in `GLOSSARY.md` and ADRs. (Neither? Use `/grill-me` instead, covered under Standalone. Both run the same `/grilling` primitive; `grill-with-docs` is the one that leaves a paper trail.)
2. **Branch: can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for; see [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md)):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch: is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. A local spec at `.scratch/<feature>/spec.md` gets a fresh implementation set under `.scratch/<feature>/implementation/issues/`. The spec is not executable work. Then work the tickets one of two ways:
     - **`/implement`** per ticket, by default **`/clear`ing context between tickets** (the continue-or-clear decision follows [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md)). On a local tracker that's one file per ticket under `.scratch/<feature>/implementation/issues/`, worked blockers-first by hand; on a real tracker the edges become native blocking links, so any ticket whose blockers are done can be grabbed. Carry settled decisions, authorization and remaining requirements into each ticket; compaction does not end an authorized objective.
     - **`/implement-spec`** for the whole spec in one run when the host supports the required subagents and isolated worktrees. It reads the approved tickets as a **task graph**, runs implementers across the ready **frontier**, and lands their work on one **integration branch**. Required checks and human acceptance still govern ticket completion.
   - **No** (it fits in one session and no spec was published) → **`/implement`** right here. A published spec always goes through **`/to-tickets`** first.

   Model selection and its runtime gate: see [model execution verification](../implement/MODEL-EXECUTION.md).

   Both implementation paths use **`/tdd`** and **`/code-review`**; shared verification rules are in [proportionate verification](../implement/VERIFICATION.md). Use `/tdd` directly for a concrete behavior to build test-first, or `/code-review` to assess a branch or PR against a fixed point.

   Visual parity (comparing built UI against a visual reference) is an extra approval step owned by `/implement`; its manifest travels through `/to-spec` and `/to-tickets`.

   When the work goes up as a pull request, **`/pr`** shapes the body with a small visual, before/after evidence and rollback risks. It is model-invoked when the agent writes a PR body.

4. **`/retro`** reviews the completed session and proposes changes to the agent's environment. Workflow lessons name their existing skill owner, overlapping guidance and an observable evaluation. It recommends automated checks for mechanical mistakes and coding standards for judgement calls. It stops after presenting the recommendations unless the user has authorized their implementation.

### Context hygiene

Keep steps 1–3 together while the host can retain the relevant context. For
clearing, compaction and handoffs, see [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md).

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create**: bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It starts with the error, owning code and smallest existing check. A clear cause gets a direct fix; uncertain failures use a **tight feedback loop** that exposes the actual bug. Shared-tooling repairs follow the bounded scope in [proportionate verification](../implement/VERIFICATION.md). Once the fix is in, recommend **`/retro`** to examine what would have prevented the bug. If there is no suitable seam for a regression test, recommend **`/improve-codebase-architecture`**.

- **A huge, foggy effort: a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time, producing **decisions, not deliverables**, until the fog is pushed back and the way is clear. Where **`/grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't, and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. `/implement` must not build directly from the map or parent spec.

## Codebase health

Not feature work, just upkeep.

- **`/improve-codebase-architecture`** runs whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities**; picking one _generates an idea_ you can take into the main flow at `/grill-with-docs`. It finds the candidates; **`/codebase-design`** (below) designs the chosen one.

## Vocabulary underneath

Two model-invoked references that run _beneath_ the other skills, each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`/domain-modeling`**: sharpen the project's _domain_ language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `/grill-with-docs` drives to keep `GLOSSARY.md` a clean glossary.
- **`/codebase-design`** is the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's _shape_: a lot of behaviour behind a small interface at a clean seam. `/tdd` and `/improve-codebase-architecture` both speak it.

## Standalone

Off the main flow entirely.

- `/chief-of-staff` coordinates a long-running goal through background subagents and a dated, commit-cited wiki. It is selected in this Codex plugin but remains in-progress and explicit-only. Recommend it when ongoing coordination and durable memory are needed; only the user invokes it. Agree on the goal, wiki location, delegation scope, and limits on environment improvements. Use `/implement-spec` for execution of one approved spec.

- **`/grill-me`**: the stateless interview for work with no repository or agreed documentation workspace under it (a plan, a design, a piece of writing); see step 1 of the main flow.
- **`/grilling`** is the interview primitive itself: rounds, the frontier, facts are the agent's job and decisions are yours. `/grill-me` and `/grill-with-docs` are the two named ways in, and `/triage`, `/wayfinder` and `/improve-codebase-architecture` all run it internally. Reach for it directly only when you want the interview with no wrapper around it.
- **`/prototype`** is a small, throwaway program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway is a constraint on how the code is written, not a promise to destroy it: the answer folds into the real code, and the prototype itself is kept as a **primary source** on a `prototype/<name>` branch out of main, pointed at from the implementation issue. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`**: investigate a scoped question against **primary sources** and leave a cited Markdown file in the repo. It works locally by default, or delegates a bounded task when authorization and tools permit. The file it produces is something to take _into_ the main flow at `/grill-with-docs`, since research feeds the thinking rather than replacing it.
- **`/to-questionnaire`** comes in when the thing blocking you isn't in your head or the codebase but in **someone else's**, and it writes them a questionnaire to fill in. It's the inverse of `/grill-me`: instead of interviewing you about the subject, it interviews you about the **send** (who it's going to, what you need back) and aims the questions at the gap. What comes back is material for `/grill-with-docs` or `/to-spec`.
- **`/wizard`** is for the steps only a **human** can take: provisioning infrastructure, setting up credentials or CI secrets, clicking through an unfamiliar third-party dashboard, running a one-off migration or cutover. It generates an interactive bash script that opens each URL, captures each value, and writes it into `.env` and GitHub secrets, so the procedure stops being something you re-explain to an agent every time. Model-invoked, so the agent reaches for it the moment it hits a wall only you can pass. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`** is the corrective for a message that didn't land. Use it mid-conversation, inside any other skill, and the agent re-pitches what it just said with the context you were missing, in plain English, using the `GLOSSARY.md` vocabulary. It works after the fact; `/grill-with-docs` is the upfront cure, because a shared language agreed early is what stops the jargon arriving at all.
- **`/teach`**: learn a concept over multiple sessions, using the current directory as a stateful workspace.
- **`/writing-for-agents`** is the reference for writing documents agents consume: skills, AGENTS.md, pointed-at docs.
