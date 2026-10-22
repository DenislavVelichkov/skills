---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs.

Return recommendations grounded in the specified session. Apply them only when the user has authorized that work; the retrospective alone does not authorize edits or hook installation.

## Steps

1. Load `writing-for-agents` through the host's skill tool, or read its discovered `SKILL.md` if no skill tool is exposed. Report an unavailable dependency.

2. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should the reviewer get a new rule, or should an existing rule change? Recommend a deterministic check for mechanical violations such as a banned API or import pattern. Reuse the repository's linter, hook or CI checks where possible. Reserve `CODING_STANDARDS.md` for judgement calls such as cross-file consistency. Use this category when the reviewer missed a mistake.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

4. Check that each candidate cites a session event or a verified repository gap.
   For a workflow lesson, identify the existing owning skill or shared reference
   and inspect overlapping guidance. Distinguish a missing instruction from one
   that was unavailable, ignored or contradicted. Propose a precise behavior
   change at that owner, replacing broad advice or duplicates instead of adding
   an incident story. Keep application repairs separate from skill changes.

5. Name an observable success criterion and an evaluation for each proposal.
   Reuse existing workflow evaluations and include a routine case that should
   not gain extra process. Present supported candidates in severity order; an
   empty list is valid. Separate instruction checks from observed agent behavior
   and measured improvement on later work. Wording alone cannot prove a speedup.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent starts from a fixed diff, requirements and repository standards. It still inspects affected callers and contracts when needed to assess the change. It usually does not need to implement or debug the fix.

This means that the review agent should be responsible for imposing coding standards, not the implementation agent.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: this file is read during review, not implementation. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Follow the advice in the `writing-for-agents` skill.
