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

First establish the change source: the base and head (or the diff the user named), then read that diff. With no base named, use the PR's base if one exists, else `git merge-base HEAD <default branch>`; if that fails, ask. Gather only evidence observed or supplied this session. Before returning, check every claim in the body against the diff and that evidence. Return the body as text unless the user asked you to create or update the PR.

Use this template for writing the PR body:

```markdown
## Summary

<diagram, diff-sketch, or tree>

## Evidence

- **Before:** <observed screenshot/output/failing run, or "not run: <reason>">
  **After:** <observed screenshot/output/passing run, or "not run: <reason>">

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

Cite only results that were supplied or that you observed: screenshots, test results, console output. Name the exact test that failed before and passes after. Prefer screenshots when the change is visual and the environment can capture them; otherwise use execution output. Redact credentials, private URLs and personal data from quoted output and screenshots; keep check names, outcomes and needed failure evidence.

Label a proposed test or pseudocode as an illustration, never as a run. Write "not run: <reason>" for a run that did not happen. When before evidence cannot be obtained, add one line stating that limitation. With no evidence at all, write "No evidence available: <reason>".

### Merge Danger

A two-way door is cheap to roll back and lower risk; destructive actions or hard-to-reverse decisions are one-way doors.

Blast radius: who or what a regression would affect, and how (layout shift, broken consumers, mobile responsiveness).
