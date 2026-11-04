---
name: pr
description: "Shapes a pull request body: the smallest visual that shows the change, before/after evidence that it works, and a merge-danger call (one-way or two-way door, blast radius). Use when writing a PR body or PR description. Returns the body text; not for opening the PR or reviewing the code."
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

Determine the base (the branch or commit the user names, otherwise the repository's default branch) and read `git diff <base>...HEAD` before writing. For the default branch, use `git symbolic-ref --short refs/remotes/origin/HEAD`, then `git merge-base` with `HEAD`; if either fails, ask the user for the base. If the diff is empty, say so and stop instead of writing a body. If `git status --porcelain` shows uncommitted changes, tell the user the body covers committed work only and list those paths; do not describe them as part of the PR. Return the PR body to the user unless they name a destination.

Use this template for writing the PR body:

```markdown
## Summary

<diagram, diff-sketch, or tree>

## Evidence

- **Before:** <observed|static|proposed> <screenshot/output/failing test run>
  **After:** <observed|static|proposed> <screenshot/output/passing test run>

## Merge Danger

**Door:** <one-way or two-way>

<optional: description>

**Blast Radius:** <short phrase naming the main impact area>

<optional: potential ramifications of merge>
```

## Sections

Skip all preambles and keep prose brief. Use the user's domain language from `GLOSSARY.md`; if there is no `GLOSSARY.md`, use the terms in the diff.

### Summary

Pick the smallest view that makes the key point clear.

Visual types: pseudocode for logic, a call tree for runtime control flow, a component tree for UI structure, a shallow file tree for file responsibility, Mermaid for interaction or data flow, a `diff` of any of these when the surrounding shape already exists, or the whole block when most of it is new. For example, a call-tree change:

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
```

When choosing a visual other than this one, read [references/visuals.md](references/visuals.md) for an example of each type.

#### Guidance

Place each visual next to the short text it supports. Keep only the calls, files, props, states, and boundaries needed to show the change.

Default to one visual; add a second only when the first leaves the key point unclear.

### Evidence

Concrete evidence that the change works.

Prefer screenshots for a visual change when the environment can take them; otherwise use execution evidence such as test results or console output. Quote the exact test command or name and its observed result before and after. Use pseudocode only to explain what a test checks, and label it as pseudocode.

Include only evidence you observed in this session. When a screenshot, baseline, or test run is unavailable, write `Not captured` with the reason; never present unrun evidence as a result. When before-evidence needs a run on the base, propose the command labelled `proposed`, or run it in a separate worktree only with the user's agreement. Label each item `observed`, `static` (read from code, not run), or `proposed` (a check the reviewer could run).

Before including a screenshot, log, or test output, check it for credentials, tokens, and private data, and redact them.

### Merge Danger

Describe whether it's a one-way or two-way door. You can walk back through two-way doors, but not one-way doors. Changes that involve destructive actions or hard-to-reverse decisions are one-way doors.

The blast radius is the potential impact of this PR. Name the consumers or surfaces that break if the change is wrong. Examples are layout shift, breakages for consumers, mobile responsiveness, etc.

### Final check

Before returning the body, check each section against the diff: every claimed change appears in it, and no significant change in it is missing from the Summary. Revise once; then remove or qualify any claim still unsupported and tell the user which.
