# Skill optimization review

Date: 2026-10-21, Europe/Sofia.
Advisor task ID: `e315642d346c4deca59f738c21dfd03a`.

## Objective and evidence

Review all 38 skills under `skills/` and correct concrete instruction defects.
The source checkout is `DenislavVelichkov/skills`, branch `dv8/main-codex`,
starting at the commit recorded in `baseline.txt`. The initial working tree was
clean. The marketplace manifest selects this repository and branch. Its Codex
manifest exposes 27 skills.

Read all 38 main skill files, invocation metadata, repository guidance,
the workflow contract tests, model execution and verification references,
the design comparison reference, the Git guardrail script, and affected docs.
Target instructions were inspected as data, not invoked.

## Proposal and acceptance criteria recorded before edits

| ID | Observed problem | Intended change and observable acceptance |
| --- | --- | --- |
| A | `ask-matt` says three selected skills need separate installation. | Remove those stale exceptions from the router and its docs. Retain discovery against the actual manifest and the recommend-only boundary. |
| B | Architecture review reverses the deletion test defined by `codebase-design`; its main pointer also implies mandatory parallel design. | Align the deletion test with its owner and retain the reference's authorized delegation or local fallback. Update the affected public pages. |
| C | `implement-spec` assumes a Skill tool, resets a mismatched worker checkout, leaves graph readiness and integrated acceptance implicit. | Require the approved ticket graph and available delegation tools, use supported skill loading, preserve existing checkout work, derive readiness from accepted integration results, and retain required final checks and human gates before closure. Keep one integration branch and the assessed versus unassessed model contract. |
| D | `retro` promises suggestions but tells the agent to build checks; it claims review needs no exploration. | Keep recommendations separate from implementation, ground them in session evidence, and describe review inputs consistently with `code-review`. |
| E | `writing-for-agents` says stronger wording cannot repair discovery, then prescribes a stronger adjective for a weak instruction. | Replace that prescription with a concrete action and observable criterion. Keep runtime-specific behavior claims conditional. |
| F | `teach` requires both self-contained HTML and shared external workspace assets, with no delivery check. | Describe one lesson file with shared workspace assets, and verify links and interactive feedback before handoff. Preserve mission, source citations, teaching method and quiz constraints. |
| G | `to-questionnaire` repeats supplied recipient questions and demands a deadline without establishing one. | Reuse supplied answers, omit unknown deadlines, label effort estimates, and retain coverage of every requested answer in the saved file. |
| H | TypeScript boundary setup says both merge and copy existing config; its completion criterion requires an umbrella check even when none exists. | Preserve existing rules and use an honest completion condition for both cases. Preserve the bundled rules and pass/fail/pass check. Repair dependency loading and avoid overwriting an existing example package. |
| I | `loop-me` names grilling without loading it; Claude handoff assigns all suggested skills to a tool without respecting explicit-only policy. | Add supported dependency loading and distinguish suggested user invocations from model-invoked dependencies. Preserve workflow-only output and Claude background handoff. |
| J | Exercise setup can select a solution-only layout despite its own linter rules, assumes an AI Hero environment, and has an unbounded repair loop. | Narrow the description to its actual environment, require the existing linter, require a problem or explainer, and allow one focused correction before reporting remaining errors. Preserve scaffold layout and commit-on-success behavior. |
| K | Pre-commit setup overwrites existing hooks, prepare scripts and formatter config, then stages every changed file. | Inspect and merge existing configuration, preserve unrelated staged work, verify the configured checks, and commit only setup-owned files. Preserve Husky, lint-staged, Prettier and available type/test checks. |
| L | Git guardrail docs claim all variants are blocked, but the bundled script uses literal regex matches. | State its actual pattern scope and preserve existing hook registrations on rerun. Keep Claude-only behavior and the script unchanged. |

These are instruction defects or contradictions, not measured performance
problems. Leave other skills unchanged. Do not rewrite prose merely for style.

## Invariants and scope

Preserve skill names, all invocation fields and picker metadata, manifest
selection, existing templates and executable scripts, domain vocabulary,
approval boundaries, and model execution settings. Keep each callable skill in
its existing directory. Update public docs for changed promoted skills. No
installation, publication, commits, target workflow execution or benchmarks are
requested. Add no dependencies or duplicate callable skills.

Validate metadata and references, compare preserved fields and files against
the baseline, review each changed instruction against A through L, and run the
repository's relevant tests. Make at most one focused correction pass after
the initial revision. Report unresolved limitations instead of repeating the
optimization loop.

## Baseline checks and limitations

- `npm test` passed all 29 tests.
- Python model-execution tests passed all 28 tests.
- Invocation policy agrees between Claude frontmatter and Codex YAML for all
  38 skills.
- `npm run check` fails before tests because `check-plugin-version` expects
  `.claude-plugin/plugin.json`, which this Codex branch does not contain.
- The fallback `quick_validate.py` reports 24 errors. Twenty-three reject the
  intentional `disable-model-invocation` or `argument-hint` fields. One treats
  the documented destination `scripts/validate-visual-acceptance.mjs` as a
  missing bundled file. The actual bundled source exists. Preserve these
  platform contracts rather than changing them to satisfy that validator.

## Advisor

Proposal checkpoint considered after independent review and baseline checks.
No consultation was spawned. Full-history forks inherit settings, and this
session does not establish that those settings match the required
`gpt-6.1-sol` at `xhigh`. The advisor instructions require disclosure and local
continuation in this case. Review count is zero; there is no pending spawn.

## Platform sources

Retrieved 2026-10-21. These support metadata, discovery and reference-layout
checks, not claims of performance improvement.

- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [Codex best practices](https://learn.chatgpt.com/guides/best-practices)
- [Agent Skills specification](https://agentskills.io/specification)
- [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## First review and correction pass

The initial revision changed 14 skills and 8 promoted docs pages, plus the misc
index. All other 24 main skill files remained unchanged. Preservation checks
passed for names, invocation fields, picker YAML, skill code blocks, scripts
and manifest selection. All 8 affected public pages retain the required
sections and absolute links. The fallback validator still reports only its
24 baseline compatibility errors, with 40 advisory warnings.

The local review found these corrections within the recorded criteria:

- A and C: the router still described one final review without the exception
  for an approved acceptance sequence that requires an earlier ticket review.
- C: the implementation instructions still mentioned a worktree reset in the
  model-binding sentence after the reset behavior had been removed. The docs
  also overstated readiness for a flat graph.
- F: call the teaching assets workspace assets to avoid implying that
  `./assets/` resolves relative to a lesson under `lessons/`.
- H: make the chosen example package path apply to the later proof steps too.
- J: retain the documented `explainer.1/` variant in the primary-folder rule.
- L: put the customized-script preservation rule before copying the script.

Apply these together as the one correction pass, then recheck affected text.
No advisor review was attempted for the same settings limitation noted above.

## Review outcome

Completed the single correction pass and rechecked its affected instructions.
The edited instructions satisfy criteria A through L. No further instruction
issues remain open within this change. This is a source review, not evidence
that a model will execute every revised workflow correctly.

Final checks:

- `npm test` passed all 29 repository tests on the final revision. Output is in
  `npm-test.txt` beside this note.
- `git diff --check` passed.
- Metadata, invocation parity, code-block preservation, source-only edits,
  manifest selection, selected directories, documentation structure and links
  passed the final assertions. Details and unchanged fallback-validator errors
  are in `validation.txt`.
- The 28 Python model-execution tests passed before editing. Their scripts,
  fixtures and model-execution reference did not change, so they were not rerun.
- The broader package check and fallback-validator limitations remain as
  recorded above. No compatibility fields were removed to silence them.

The final diff changes 14 skill files, 8 public docs pages and the misc index.
All 24 other main skill files are byte-for-byte unchanged. Names, invocation
settings, picker YAML, executable scripts, examples and plugin selection remain
unchanged. The three description edits clarify existing tasks or tool limits.

Target workflows, activation trials and performance comparisons were not run.
No performance or reliability improvement is claimed. The installed plugin was
not refreshed, and no changes were committed or published. Temporary Python
bytecode from the checks was removed; only these small review records remain.
