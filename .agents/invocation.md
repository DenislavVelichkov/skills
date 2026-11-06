# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing**: a one-line summary read by a person browsing slash-commands. Strip trigger lists ("Use when the user says…").
- **Model-invoked**: reachable by **model or user**. The default: omit `disable-model-invocation` and the `policy` block from `agents/openai.yaml`. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)

Each harness excludes a user-invoked skill from the model's reach in its own way, so nothing but the human can fire it: no other skill can. A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Every skill also carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata: `interface.display_name` and `interface.short_description` for the skill picker, and, for user-invoked skills, the `policy.allow_implicit_invocation: false` that pairs with `disable-model-invocation`. Keep the two in sync: a skill is user-invoked in both harnesses or neither.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between them

For an active model-invoked dependency, explicitly call the Skill tool with its
registered name, such as `grilling`. A bare `/skill` mention recommends a command
to the human. Shared reference files stay with their existing owner; read a
direct relative link such as `implement/VERIFICATION.md` without invoking the
owning explicit-only skill. Reference loading grants no execution permission.

This is about **operative** instructions: a skill's own steps telling the agent to go run another skill right now. Router prose that just names skills for a human to pick from (`ask-matt`, bucket `README.md`s) isn't invoking anything, so it keeps `/skill`-style names as plain labels.

The Skill tool takes one skill per call. A step that needs two skills is two calls, not one call with two names: say so (`Call the Skill tool twice, for "grilling" and "domain-modeling"`), not "call it with X and Y," which reads as a single call taking both.

This whole convention only holds when the named skill is **model-invoked**. A user-invoked skill can never be reached this way, full stop: per the invariant above, no other skill can call it, including by naming it to the Skill tool. When a step's precondition is a user-invoked skill (e.g. `setup-matt-pocock-skills`), phrase it as an instruction for the human to act on: "tell the user to run `/setup-matt-pocock-skills`", never as a Skill tool call.

## Passive vs active domain work

Merely _reading_ `GLOSSARY.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `GLOSSARY.md` inline) is `domain-modeling`.

## Runtime authoring record

Checked 2026-11-06 against Anthropic's
[skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
and the [Claude Code skill contract](https://code.claude.com/docs/en/skills).
Keep descriptions specific and steps concise, with conditional references
directly reachable from SKILL.md. The shared visual and verification references
remain in `implement`; reading them does not invoke that manual-only skill.
This resolves the older dependency wording above without broadening invocation.

Preserve actual frontmatter, arguments and tool names. Keep existing
`disable-model-invocation`, `user-invocable`, `allowed-tools`, `context` and
`agent` fields where present; do not add Codex metadata or new permissions.
`allowed-tools` affects permission, and `context: fork` supplies an isolated
subagent without conversation history. Give any authorized delegated task its
required inputs; this refactor changes neither delegation nor model gates.
Text-contract checks establish consistency only. Verify routing and an
authorized isolated workflow separately before claiming runtime adoption.
