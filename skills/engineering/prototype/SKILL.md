---
name: prototype
description: Builds a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like. Not for production implementation or static design critique.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

Reuse settled design answers within their approved scope. If the design
question is already answered, say so and skip the prototype. A
chosen prototype does not authorize implementing it in production code.

## Pick a branch

Identify which question is being answered, using the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single shareable HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations on a single route, switchable via a URL search param and a floating bottom bar.

If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Before writing prototype code, create a throwaway `prototype/<name>` branch from the default branch (`origin/HEAD`, else a user-approved base, else the current branch), preferably in a separate worktree; never prototype on the default branch. Leave the user's uncommitted work out of prototype commits by staging only prototype paths, and report what was left uncommitted. If switching would conflict with it, stop and ask; if the user approves a stash, record its ref and the original branch and restore both when done, whatever the outcome. Outside a git repo, use a clearly named prototype directory and say so. Put the prototype next to the module or page it's for, named so a casual reader sees it's a prototype. For UI routes, follow the project's routing convention.
2. **Trivial to run.** A UI prototype starts from one command in the project's task runner: `pnpm <name>`, `python <path>`, `bun <path>`, etc. A logic demo is a single HTML file the user double-clicks.
3. **No persistence by default.** State lives in memory. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state so the user can see what changed.
6. **Capture it when done.** Record the validated decision for the authorized implementation ticket, then capture the prototype itself as a **primary source**: commit only its paths to the throwaway branch (local commits there need no confirmation), and, after the user confirms, push it and leave a context pointer to that branch on the implementation issue. Capture the answer too (the verdict and the question it settled) in a commit, and in the issue only after the user confirms the post. If no implementation issue exists, report the verdict and the branch name to the user instead of posting. The default branch keeps only the validated decision.
