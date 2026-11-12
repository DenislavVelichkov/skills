---
name: handoff
description: Writes a handoff document so a fresh agent can continue the work. For staying in the same session, use /compact.
---

Summarise the current conversation so a fresh agent can continue the work. Save to a unique file (name prefix `handoff-`) in the user's OS temporary directory, using the platform's temporary-file API or configured temp directory. Report the absolute saved path. If the next session may run elsewhere or after a restart, say this path is ephemeral and offer a durable location the user chooses.

Use these headings in this order: Objective, Authorization, Decisions (with
reasons), Done, State, Remaining, Blockers, Next action, Suggested skills (model-invoked skills
to load through the destination host's mechanism; explicit-only skills as user
choices, since reading the handoff does not invoke them). Record each authorization with its exact scope and source (who
gave it, and where). It covers only that scope; anything outside it, and any
external write whose outcome is uncertain, needs user confirmation. For repository work, record the checkout, branch, relevant commits,
and uncommitted changes. Preserve pending approvals and uncertain external writes
so continuation can check them before retrying.

Reference existing artifacts (specs, plans, ADRs, issues, commits, diffs) by path or URL instead of copying them.

Redact secrets (API keys, passwords) and personally identifiable information.

Tailor the doc to any arguments; they describe the next session's focus.

Before finishing, check that the file exists, its artifact references identify
the correct work, and the next agent can see what is done and what remains.
Correct failed checks once, recheck the affected headings and references, then
report any remaining gap and any inaccessible or temporary dependency.
