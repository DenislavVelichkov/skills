---
name: pr
description: "Writes a concise pull request body with a summary visual, observed before/after evidence, and a merge-danger assessment. Use when opening or drafting a PR or writing a PR description. Not for commit messages or reviewing a PR."
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

First establish the change source: the base and head (or the diff the user named), then read that diff. With no base named, use the PR's base if one exists; else find the default branch with `git symbolic-ref --short refs/remotes/origin/HEAD` and take `git merge-base` of it with `HEAD`; if either fails, ask. If the diff is empty, say so and stop instead of writing a body. If `git status --porcelain` shows uncommitted changes, tell the user the body covers committed work only and list those paths; do not describe them as part of the PR. Gather only evidence observed or supplied this session. Before returning, check the body in both directions: every claim appears in the diff or that evidence, and no significant change in the diff is missing from the Summary. Revise once; then remove or qualify any claim still unsupported and tell the user which. Return the body as text unless the user asked you to create or update the PR.

Use this template for writing the PR body:

```markdown
## Summary

<diagram, diff-sketch, or tree>

## Evidence

- **Before:** <observed|static|proposed> <screenshot/output/failing run, or "Not captured: <reason>">
  **After:** <observed|static|proposed> <screenshot/output/passing run, or "Not captured: <reason>">

## Merge Danger

**Door:** <one-way or two-way>

<optional: description>

**Blast Radius:** <affected consumers or systems, and what breaks for them if this regresses>
```

## Sections

Skip all preambles and keep prose brief. If the repo has a `GLOSSARY.md`, use its domain terms; otherwise use the terms in the code and the user's request.

### Summary

Pick the smallest view that makes the key point clear: pseudocode for logic, a call tree for runtime control flow, a component tree for UI structure, a shallow file tree for file responsibility, Mermaid for interaction or data flow, and `diff` when the surrounding shape already exists and the point is what changes. Place each visual next to the short text it supports, and usually use one or two. When the right form is unclear, read [VISUALS.md](VISUALS.md) for an example of each.

### Evidence

Cite only results that were supplied or that you observed: screenshots, test results, console output. Name the exact test that failed before and passes after. Prefer screenshots when the change is visual and the environment can capture them; otherwise use execution output. Redact credentials, tokens, private URLs and personal data from quoted output and screenshots; keep check names, outcomes and needed failure evidence.

Label each item `observed`, `static` (read from code, not run), or `proposed` (a check the reviewer could run, or pseudocode that explains a test); never present a `proposed` item as a run. Write "Not captured: <reason>" for a screenshot, baseline or run that did not happen. When before evidence needs a run on the base, propose the command labelled `proposed`, or run it in a separate worktree only with the user's agreement; when it cannot be obtained, add one line stating that limitation. With no evidence at all, write "No evidence available: <reason>".

### Merge Danger

A two-way door is cheap to roll back and lower risk; destructive actions or hard-to-reverse decisions are one-way doors.

Blast radius: who or what a regression would affect, and how (layout shift, broken consumers, mobile responsiveness).
