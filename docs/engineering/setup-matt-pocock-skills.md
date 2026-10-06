## What it does

`setup-matt-pocock-skills` configures repository issue tracking, domain docs,
review guidance and local verification. It reuses the tools and choices already
present, then asks only about unresolved decisions. Its output belongs to the
repository, where the engineering skills and commit checks can use it.

The skills read the repository's guidance at run time. Tracker configuration
supports GitHub, GitLab, local markdown and a custom workflow. Local checks use
installed tools and repository-owned hooks. The dormant visual protocol and
validator apply when the project requires a named production/reference
comparison.

The tracker file also tells agents to record implementation results in the existing issue or ticket, including verification and work still open. A commit reference alone does not update that record. Re-running setup adds missing conventions while preserving the repo's tracker choices and local guidance.

It is a prompt-driven skill, not a deterministic script. It reads your `git remote`, existing `AGENTS.md` and `CLAUDE.md`, and `GLOSSARY.md`, reuses choices and authorization already supplied, and asks only about unresolved decisions before writing the agreed setup.

## When to reach for it

You invoke this by typing `/setup-matt-pocock-skills`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own. Its metadata marks it non-invokable on purpose, so no other skill can fire it for you.

Reach for it once per repo, before the first use of any other engineering skill. If [triage](https://aihero.dev/skills-triage), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets) or [wayfinder](https://aihero.dev/skills-wayfinder) start guessing where your issues go, or apply labels your tracker doesn't have, this repo has not been set up yet. You can run it in a repo halfway through a project. The skill reads what is already there, so no earlier work is lost.

## Prerequisites

It writes into the repo you run it in:

| It writes                         | Where                                                                 |
| --------------------------------- | --------------------------------------------------------------------- |
| `issue-tracker.md`                | `docs/agents/`                                                        |
| `domain.md`                       | `docs/agents/`                                                        |
| `triage-labels.md`                | `docs/agents/`, only when the `triage` skill is installed             |
| `visual-acceptance.md`            | `docs/agents/`                                                        |
| `visual-acceptance.template.json` | `docs/agents/`                                                        |
| `validate-visual-acceptance.mjs`  | `scripts/`                                                            |
| Local verification guidance       | `docs/agents/local-verification.md`, or its existing equivalent       |
| Local commit checks               | Existing hook manager or repository-owned Git hook and check commands |
| Review criteria                   | Existing review guidance or `CODING_STANDARDS.md`                     |
| An `## Agent skills` block        | `AGENTS.md` for Codex or `CLAUDE.md` for Claude Code, when present    |

All outputs are saved in the repository; commit them according to the project's workflow. There is no user-level or global mode: the config lives in the repo, so every repo gets its own copy.

## Repository choices

It starts each section with the recommended answer, and skips any question its exploration already answered. Settled choices do not need another confirmation.

| Decision               | What it proposes                                                                                                                                      | When it asks                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Issue tracker**      | the one matching your `git remote`                                                                                                                    | when existing configuration or your request has not already settled it                  |
| **Triage labels**      | keep category names `bug` and `enhancement` plus the five state names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) | only if the `triage` skill is installed                                                 |
| **Domain docs**        | single-context: one `GLOSSARY.md` plus `docs/adr/` at the root                                                                                        | only if it spots monorepo signals, and then it offers a multi-context `GLOSSARY-MAP.md` |
| **Local verification** | fast, offline lint and local documentation link checks that block a bad staged commit                                                                 | when check coverage or failure behavior has not already been settled                    |

The tracker options:

| Option             | Where issues live                              | Needs                                          |
| ------------------ | ---------------------------------------------- | ---------------------------------------------- |
| **GitHub**         | the repo's GitHub Issues                       | the `gh` CLI                                   |
| **GitLab**         | the repo's GitLab Issues                       | the `glab` CLI                                 |
| **Local markdown** | files under `.scratch/<feature>/` in this repo | nothing, not even a remote                     |
| **Other**          | wherever you say                               | one paragraph from you describing the workflow |

The first three ship as templates in the skill and work out of the box. Local markdown is a first-class option, not a fallback: a solo project with no remote is fully supported. One caveat is worth repeating: don't use local markdown if you're using GitHub. They are alternatives, not layers.

Visual acceptance is conditional. The installed pointer
defines one narrow trigger: the work requires a named production surface to be
compared against a visual reference, requires selecting and freezing that
reference for the later comparison, or links an existing manifest that records
either obligation. Only that visual parity action creates a manifest. Ordinary
UI work uses the normal workflow. The validator keeps
reference selection, production comparison, human acceptance, and baseline
promotion as separate states.

"Other" is a full option too. It is how Jira, Linear, Azure DevOps and Beads all work. You describe the workflow, the skill records your prose in `docs/agents/issue-tracker.md`, and the downstream skills follow the prose. Users have already built this: a Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) variant, a Gitea CLI shaped like `gh`, a hand-built local dashboard.

The seed tracker commands use supported structured or file input. Setup checks
version-specific options against the installed CLI before relying on them.
Visual planning corrects source-supported validation faults in a bounded pass;
persistent errors remain explicit blockers, with no invented evidence.

## Fast checks, explicit acceptance

A local commit check catches mechanical failures in the staged candidate. It
leaves files unchanged and uses installed tools. Builds, service startup,
emulators, full tests and acceptance journeys run at their explicit workflow
steps. Setup preserves existing hooks and a recorded local-only choice.

Where applicable, setup also places visual fidelity in review guidance, short
native checks before long journeys, read-only evidence verification and a
compact current checkpoint with linked history. These extend the existing
workflow and preserve its acceptance and human approval requirements.

## Common questions

**Do I have to use GitHub?**

No. GitHub, GitLab and local markdown under `.scratch/` all ship as ready-made templates, and anything else works through the "other" path. This is the most-repeated question, in roughly these words: _"hard locked to github"_, _"can I use GitLab / Jira"_, _"what about Azure DevOps"_. The answer is always the same: setup chooses the tracker, not the skill.

**Can commits be checked locally without GitHub Actions?**

Yes. Choose a blocking local hook for lint and documentation links. Setup reuses
repository tools and validates the staged files, including partial staging.
Offline link checks cover local targets; remote URL health is separate. A
local-only choice is preserved without adding a hosted CI/CD pipeline.

**Do I need to re-run it after updating the skills?**

Rerun it when you want missing setup conventions added, or when a downstream
skill and the repository guidance disagree. It preserves existing tracker,
labels, hook configuration and local choices while preparing the update.

**It wrote to `CLAUDE.md`, but I'm on Codex.**

Setup now selects `AGENTS.md` for Codex and `CLAUDE.md` for Claude Code when both exist. If the active agent's file is missing, it asks which file to use. Earlier runs may have put the block only in `CLAUDE.md`; re-run setup in Codex to put it where Codex reads it.

**It didn't create my triage labels.**

It doesn't. `docs/agents/triage-labels.md` is a _mapping_: it tells `/triage` which strings in your tracker correspond to the five canonical roles. It does not run `gh label create`. On a fresh GitHub repo the labels do not exist yet, and users have filed this as a bug more than once. Two consequences:

- If your tracker already uses the canonical names, the mapping is an identity table and there is nothing to configure. That is the intended common case, not a missing step.
- This skill does not create [wayfinder](https://aihero.dev/skills-wayfinder)'s `wayfinder:map` and `wayfinder:<type>` labels either, and `gh issue create --label <missing>` fails instead of creating the label. Create them by hand before the first wayfinder run on a GitHub repo.

**Can I configure the other skills' behaviour here ([grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) cadence, question format, tone)?**

It configures repository boundaries such as tracker, labels, doc layout and
local verification. Personal cadence, question format and tone belong in the
instruction file your coding tool reads. Setup preserves those instructions.

**Can I keep the config in `~/.claude` instead of committing it to every repo?**

Not today. A user who runs the skills across many repos has an open request for this, but no user-level mode exists. Every repo carries its own `docs/agents/`.

**Isn't it strange to have a skill that configures the other skills?**

One long-standing complaint says yes, in these words: _"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."_ The trade-off is real. Without a setup step, every skill that touches issues would need its own copy of the tracker instructions. The output is markdown you can read and edit, and that limits the risk. You can read every file it wrote and change it by hand. Make day-to-day changes that way, not with another run.

## It's working if

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist, plus `triage-labels.md` if `triage` is installed.
- An `## Agent skills` section appears in the instruction file your harness reads, with a one-line summary pointing at each of those files.
- The tracker it proposed matches the remote you use, and the label strings match labels that exist in your tracker.
- Afterwards, `/to-tickets` publishes without asking you where issues live, and `/triage` applies labels rather than inventing them.
- Nothing in the skill files themselves changed. If setup edited a `SKILL.md`, something went wrong.
- Valid staged changes pass; a lint failure or broken local link blocks a
  commit. An unstaged repair cannot hide either staged failure.
- Rechecking unchanged evidence leaves repository files unchanged, and current
  progress points to history instead of repeating it.
- Repositories expose the visual parity action test through the instruction
  file the active harness reads. UI work without a production-to-reference
  comparison creates no manifest.

## Where it fits

`setup-matt-pocock-skills` is the **run-once setup** for the engineering flow, the precondition everything else assumes rather than a step in the chain. Its neighbours are its readers: [triage](https://aihero.dev/skills-triage), which applies the label vocabulary written here; [to-spec](https://aihero.dev/skills-to-spec) and [to-tickets](https://aihero.dev/skills-to-tickets), which publish into the tracker named here; and [wayfinder](https://aihero.dev/skills-wayfinder), which reads the "Wayfinding operations" section of the same tracker file to learn how to store maps and child [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket). [domain-modeling](https://aihero.dev/skills-domain-modeling) later fills in the domain-doc layout that setup records. It creates `GLOSSARY.md` and ADRs only when you resolve a term or decision, so a repo with no domain docs after setup is normal. For which skill to reach for next, [ask-matt](https://aihero.dev/skills-ask-matt) routes the whole set.
