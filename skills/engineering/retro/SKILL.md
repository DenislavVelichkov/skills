---
name: retro
description: "Runs a retrospective on a coding session and recommends improvements to the agent environment: AGENTS.md or CLAUDE.md, coding standards, automated checks, and tooling."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs.

Return recommendations grounded in the specified session. Apply them only when the user has authorized that work; the retrospective alone does not authorize edits or hook installation.

## Steps

1. Call the Skill tool with `writing-for-agents` for the writing style guide. If that skill is unavailable, say so and continue with plain, imperative recommendations.

2. Read the primary sources for the session the user specifies. If the user doesn't specify a session, default to the current one. For another session, use the identifier or log path the user gives; if you cannot locate it, ask for one. Report any source you could not read, and limit recommendations to the evidence you could access. Cite events by timestamp or tool call; never reproduce secrets, tokens, or private data found in logs.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should the reviewer get a new rule, or should an existing rule change? Recommend a deterministic check for mechanical violations such as a banned API or import pattern. Reuse the repository's linter, hook or CI checks where possible. Reserve `CODING_STANDARDS.md` for judgement calls such as cross-file consistency. Standards belong to the review stage, which starts from a fixed diff and carries less context pressure than implementation. Use this category when the reviewer missed a mistake. First check whether the repo has a review stage or a standards file; if it has neither, route mechanical rules to automated checks and recommend judgement rules only as a proposal to add one.
- **AGENTS.md / CLAUDE.md (repo or global)**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file, in the repo or the user's global scope, runs over about 200 lines or holds rules a linter or test could enforce (a heuristic; use the maintainer's threshold if one exists).
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ a steering file passes the same size heuristic as the AGENTS.md category.
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
   empty list is valid. Severity: `high` when the gap caused a wrong result or
   would recur on routine work, `medium` when it cost significant time or
   tokens, `low` for polish. Separate instruction checks from observed agent behavior
   and measured improvement on later work. Wording alone cannot prove a speedup.

6. Report each candidate with: category, cited event or verified gap, owner
   file, proposed change, success criterion and evaluation, and severity.

## Reference

### Files

Check for these files; the target repo may lack some of them:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: where the repo has one, it is read during review, not implementation. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use a skill when the agent must discover the guidance by task (its description sits in the agent's context window), or for a user-invoked command; use a doc when another file can point to it. Follow the advice in the `writing-for-agents` skill.
