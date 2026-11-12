---
name: wizard
description: Generates an interactive Bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.
---

# Wizard

A **wizard** is a bash script that walks a human, step by step, through a manual procedure that's tedious to do by hand and tedious to re-explain to an AI every time. It opens each URL, says exactly what to click and copy, captures the values, writes them where they belong (`.env`, GitHub secrets), confirms at every stage, and shows how many stages are left. It might configure third-party services, run a one-off migration, or move the project from one state to another.

The delightful UX is already solved by [template.sh](template.sh): stage-by-stage progress, confirmation gates, cross-platform URL opening (including WSL), hidden secret entry, idempotent `.env` upserts (in shell single-quote form), `gh secret`/`gh variable` writes, and a closing summary. **Your job is only to scope the procedure and author its stages.** The library above the `STAGES` marker is identical in every wizard; that consistency is the point: never hand-edit it.

A wizard is ephemeral by default: built for one run, saved to a scratch or `scripts/` path, deleted when the job's done. Commit it only when the user wants a repeatable setup path that should live in the repo.

## Process

### 1. Scope the procedure

Work out every manual step the human must take and every value that gets captured along the way. Read the repo first, don't ask cold:

- For setup: `.env.example`, key names only from `.env` and `.env.*` (`awk -f env-keys.awk .env` with this skill's [env-keys.awk](env-keys.awk); never read values into context), `README`, `docker-compose*`, framework config, and `.github/workflows/*` (every `secrets.*` / `vars.*` reference is a value the wizard must produce).
- For a migration or transition: the current state, the target state, and the irreversible actions between them.

If the wizard writes `.env` (or `$ENV_FILE`) inside a git repo, check that file before writing any secret to it: `git ls-files --error-unmatch <file>` succeeding means it is tracked, so stop and tell the user; `git check-ignore -q <file>` failing means it is not ignored, so propose adding it to `.gitignore` and add it only with the user's agreement. Outside a git repo, both checks pass. The template's `write_env` repeats these checks at run time with no override (it refuses a tracked file, and an unignored one until it is ignored), applies them to the real file behind a symlinked `ENV_FILE`, and warns outside a git repo. When other users can read the file, it offers `chmod 600` and, if the human declines, asks before writing. A refusal or a failed write stops the wizard and leaves the file unchanged. It stores each value in shell single quotes, with an apostrophe written as `'\''`, replacing any existing `KEY=`, `KEY =` or `export KEY=` line. On a re-run, an existing line it can't decode safely (one with an inline `# comment`, for example) is asked for again.

Show the ordered stages and the values each produces, and invite the user to
add, drop, or reorder them. Reuse choices and authorization already supplied.
Ask only about missing decisions that change the procedure, and continue
drafting the stages that are settled. Present the finished script for review
before any still-unapproved external action.

**Done when:** every stage is named in order, and for each captured value you know (a) where the human gets it, (b) where it's written (`.env`, a GitHub secret, both, or nowhere; some stages are pure actions), (c) whether it's secret (hidden entry) or public, and (d) if a value can contain an apostrophe, that the project's env loader reads shell single-quoted values as `source` does.

### 2. Map each stage's journey

For each stage, write the precise path a human follows: which URL to open, what to do there, where a value is shown, which variable it fills: e.g. "Dashboard → Developers → API keys → Reveal test key → copy". Where you don't actually know the current UI or the exact command, say so and ask the user or check the docs: never invent steps that may not exist.

**Done when:** every stage traces to concrete instructions a stranger could follow.

### 3. Author the wizard

Copy `template.sh` to the target path. Replace the example stage with one `stage` per step, in dependency order. Use the library helpers: `stage`, `say`/`step`, `open_url`, `ask`/`ask_secret`, `write_env`, `set_secret`/`set_var`, `pause`/`confirm`. Set `TOTAL_STAGES` to the number of stages you wrote; the wizard warns when the count and the stages run disagree. `confirm` returns non-zero on no, which ends the script under `set -e`, so call it as `if confirm "..."; then ...; fi`, as the example stage does, or as `confirm "..." || exit 1`.

Hold the bar the template sets: open the URL before asking for its value, use `ask_secret` for anything secret, `write_env` only the values the local project reads from `.env`, `set_secret`/`set_var` alone for GitHub-only values and only for the ones CI actually needs, and `confirm` before any irreversible action. Each `stage` clears the screen so only the current step is visible: keep a stage to one focused task so nothing the human needs scrolls away.

### 4. Verify and hand off

- `bash -n <script>`; run `shellcheck` if available. Fix reported issues in your stages and rerun, at most twice. Then report any remaining warnings, and if a check still fails, don't call the wizard ready to run.
- `chmod +x <script>`.
- Don't run it end-to-end yourself: it opens browsers and blocks on human input. Trace it statically instead: the number of `stage "` calls in `run_wizard` equals `TOTAL_STAGES`, every value from step 1 is captured and lands where step 1 said, and every `set_secret` name exactly matches a `secrets.*` reference in CI.
- Tell the user how to run it: the exact working directory and command (e.g. from the repo root, `bash scripts/<name>.sh`), since `.env` and `gh` resolve from the current directory, plus `ENV_FILE=<path>` when `.env` is not at the root. If the user wants a repeatable setup path, offer to commit it and link it from the README so the next person runs the script instead of asking an AI.
