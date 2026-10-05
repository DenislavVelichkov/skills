---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to a unique file in the user's OS temporary directory, using the platform's temporary-file API or configured temp directory. Report the absolute saved path.

Include the objective, confirmed scope and authorization, key decisions and
reasons, completed work, current state, remaining requirements, blockers, and
next action. For repository work, record the checkout, branch, relevant commits,
and uncommitted changes. Preserve pending approvals and external writes whose
outcomes are uncertain so continuation can check them before retrying.

Include a "suggested skills" section. Name available model-invoked skills to
load through the destination host's supported mechanism. Mark explicit-only
skills as choices for the user to invoke; reading the handoff does not invoke them.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

Before finishing, check that the file exists, its artifact references identify
the correct work, and the next agent can see what is done and what remains.
Report inaccessible or temporary dependencies explicitly.
