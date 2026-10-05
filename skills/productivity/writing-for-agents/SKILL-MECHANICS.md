# Skill mechanics

The skill-specific reference for [writing-for-agents](SKILL.md): metadata,
invocation policy, dependencies, and routers.

## Invocation

Preserve the target's existing invocation mode unless the user requests a change.

- A **model-invoked** skill is available to the model and user. Its description
  names the distinct tasks that should trigger it. In this repository, omit
  `disable-model-invocation` from frontmatter and the `policy` block from
  `agents/openai.yaml`.
- A **user-invoked** skill requires the human to invoke it. Keep its description
  as a human-facing summary. Set `disable-model-invocation: true` for Claude
  Code and `policy.allow_implicit_invocation: false` in `agents/openai.yaml`
  for Codex. Other skills may recommend it but cannot execute it.

Both kinds retain `name` and `description`. In Codex, also preserve picker
metadata in `agents/openai.yaml`. Metadata visibility and context cost depend
on the host; an explicit-only skill missing from implicit discovery is not
proof that it is uninstalled.

For a model-invoked dependency, load its available skill through the host's
skill tool. If no such tool is exposed, read its discovered `SKILL.md` before
following it. Load dependencies separately and report missing required skills.

Shared reference files can stay under their owning skill. A conditional link
to a plain file reads reference material without invoking the owner.

## Splitting by invocation

Create a separate model-invoked skill only for a distinct task that warrants
independent discovery or is a required dependency. Keep essential decisions in
the main file; disclose branch-specific detail behind conditional pointers.

## Router skills

A user-invoked router recommends skills and explains their trigger boundaries.
It verifies relevant skill behavior as reference material before describing or
skipping a step. It never executes an explicit-only skill. Check the plugin's
selected set or registration before recommending a route; mark unavailable
steps honestly.
