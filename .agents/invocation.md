# Model-invoked vs user-invoked

Preserve the selected skill's invocation policy in both platforms.

| Invocation    | Claude Code `SKILL.md`           | Codex `agents/openai.yaml`                | Description                   |
| ------------- | -------------------------------- | ----------------------------------------- | ----------------------------- |
| User-invoked  | `disable-model-invocation: true` | `policy.allow_implicit_invocation: false` | Human-facing summary          |
| Model-invoked | Omit `disable-model-invocation`  | Omit the `policy` block                   | Model-facing trigger branches |

Both kinds retain a `name` and `description`. Invocation is controlled by the
host's policy, not by deleting descriptions. Each skill also has
`interface.display_name` and `interface.short_description` in `agents/openai.yaml`.
Keep policy and picker metadata consistent. Bucket and root READMEs group
skills by invocation.

Only the human invokes a user-invoked skill. Other skills may recommend it,
but must not execute it or bypass its policy by reading its instructions.

## Dependencies between skills

For a model-invoked dependency, state the action explicitly:
"Load the available `grilling` skill and follow it." Use the host's skill tool
when exposed; otherwise discover and read the registered `SKILL.md` through
the supported loading mechanism. Report a required dependency that cannot be
loaded instead of improvising it or claiming it ran.

Load each dependency separately. Use its registered name and supported tool
schema; a Claude `Skill` tool name is not a universal Codex tool contract.
Check the selected plugin manifest or registration when implicit discovery
omits an explicit-only skill. The root `.codex-plugin/plugin.json` determines
this fork's Codex exposure; Claude metadata does not expand that selection.

Router prose recommends `/skill` names for the human. A router may inspect a
skill as reference material to verify that recommendation, then stops without
executing it. Reading for inspection is distinct from following its workflow.

Shared reference files stay with their existing owner. Use a conditional
relative link to read a plain reference such as `implement/VERIFICATION.md`;
that does not invoke the owning explicit-only skill.

When a precondition requires a user-invoked skill, tell the user to run it.
Do not silently run it as a dependency.

## Passive vs active domain work

Reading `GLOSSARY.md` for vocabulary is a prose pointer, not `domain-modeling`.
Use `domain-modeling` for active work: challenging terms, exploring edge cases,
writing ADRs, and updating the glossary as decisions resolve.

## Runtime authoring record

Checked 2026-11-06 for #189 against OpenAI's
[Codex skill guidance](https://developers.openai.com/codex/skills/), now resolved
to [Build skills](https://learn.chatgpt.com/docs/build-skills).
Keep the job focused, the discovery description specific, and the steps
imperative with explicit inputs and outputs. Keep conditional references
directly reachable from SKILL.md; prefer instructions over new scripts.

This refactor preserves the Codex manifest's selected skills and every existing
`agents/openai.yaml` policy and tool dependency. Model-invoked dependencies use
the supported loading mechanism above; reading a shared reference does not
invoke its explicit-only owner. Keep runtime tool names and model gates intact.
Text-contract checks establish consistency only. Verify routing and an
authorized isolated workflow separately before claiming runtime adoption.
