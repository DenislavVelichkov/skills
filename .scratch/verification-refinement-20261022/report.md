# Verification skill refinement

Updated the maintained mattpocock-codex source on October 22, 2026. The changes are uncommitted on `dv8/main-codex` in `/home/dv8/Projects/codex-claude-plugins/mattpocock-dv8`. No plugin publication or installation occurred. The application and its active acceptance work were untouched.

## Changed behavior and ownership

| Maintained file | Change |
| --- | --- |
| `skills/engineering/implement/VERIFICATION.md` | Replaces broad compatibility and retry advice with checks for the real invocation, producer/consumer compatibility, exercised assertions, restoration and prerequisite lifetime. Classifies failures, requires bounded diagnosis before reruns, and respects existing advisor limits. |
| `skills/engineering/implement/SKILL.md` | Points to preparation and recurring-failure diagnosis before costly runs. |
| `skills/engineering/implement-spec/SKILL.md` | Requires implementers to apply the same shared guidance. |
| `skills/engineering/tdd/SKILL.md` | Requires actual producer output through the consumer, successful consumption and rejection of incomplete or incompatible outputs. |
| `skills/engineering/code-review/SKILL.md` | Assesses retained invocation, artifact, coverage and rerun evidence without starting live journeys. Delegated briefs carry the same scope. |
| `skills/engineering/retro/SKILL.md` | Maps lessons to existing owners and overlap, distinguishes missing guidance from failed adoption, and requires an observable evaluation. |
| `skills/engineering/ask-matt/SKILL.md` | Updates implementation and retro routing summaries. |
| `docs/engineering/implement.md`, `implement-spec.md`, `tdd.md`, `code-review.md`, `retro.md`, `ask-matt.md` | Updates the corresponding human-facing explanations. |
| `scripts/workflow-contract.test.mjs` | Adds 11 instruction-contract tests within the existing framework. |

The shared reference remains the policy owner. TDD owns the artifact test method, review owns passive assessment, and retro owns lesson selection. Existing evidence reuse, immutable original proof, approved scheduling, human acceptance, security, accessibility and financial non-retry boundaries remain intact. Routine changes need no extra preparation record. Permitted first collection can obtain missing samples without requiring a full capture beforehand; permission to collect does not prove complete coverage.

No skill names, frontmatter, invocation metadata, plugin selections, dependencies or runtime scripts changed. Normative instructions contain no incident identifiers or project-specific paths.

## Checks and their limits

| Check | Result |
| --- | --- |
| Baseline workflow-contract tests | 20 passed before edits. |
| Final `npm test` | 40 passed, zero failures or skips. Includes 31 workflow-contract tests and 9 visual-acceptance validator tests. |
| `git diff --check` | Passed. |
| YAML, metadata and local links | All six changed skills have parseable YAML, unchanged frontmatter and invocation metadata, and resolving local Markdown links. |
| `quick_validate.py` | TDD and code-review pass with advisory maintenance warnings. The four explicit-only skills fail because this generic validator rejects their unchanged `disable-model-invocation` field. The owning repository requires that field; it was preserved. |
| `analyze_skill.py` | All six analyses ran. Generic section, maintenance and score suggestions do not justify changing the repository's established structure. No missing local references were reported. |
| `npm run check` | Stops in `check-plugin-version` because `.claude-plugin/plugin.json` is absent from this Codex branch, including its starting commit. The unchanged script only checks the Claude manifest. The test suite was run separately. |
| Claude validation | Not run. No Claude manifest changed. |
| Advisor | No consultation ran because full-history model/effort compatibility could not be verified. No advisor slots were consumed. |

The generic validator mismatch and aggregate-check failure remain unresolved. No validator or invocation policy was changed to manufacture a pass.

## Behavior exercise

A fresh agent received the revised skills and scenario inputs, without the task notes or test assertions. It performed a read-only decision exercise, not actual implementation or runtime validation.

| Scenario | Observed decision |
| --- | --- |
| Installed command resolves the wrong executable path | Hold the expensive run; repair and test the actual entry point. |
| Builder output lacks a consumer-required field | Test actual output through the consumer, then repair and check malformed outputs. |
| Repeated failures without a short reproducer | Reject an unexplained unchanged rerun; require bounded reproduction or a stated diagnostic hypothesis and stop condition. |
| Native retention despite passing desktop mocks | Use a bounded native check with process identity and resource measurements. |
| Prerequisite expires before expected completion | Refresh or use supported renewal/splitting without weakening freshness rules. |
| Unchanged applicable proof after a documentation edit | Preserve proof through the project verifier instead of recapturing. |
| Routine typo correction | Inspect the edit and run ordinary required checks; add no preparation tooling. |
| Metadata reports more scenarios than assertions exercised | Report incomplete coverage and unproven cleanup passively. The initial answer risked blocking first collection; see the correction below. |
| Existing guidance was never loaded | Investigate discovery/adoption at the existing owner instead of duplicating a global rule. |
| Exhausted advisor budget and uncertain financial mutation | Reconcile the mutation outcome before retry; invent no new consultation capacity. |
| Failure only reproduces after hours | Require documented cheaper attempts, a discriminating observation and a stop condition for an authorized diagnostic run. |

One interpretation needed clarification. The first answer about incomplete coverage implied all missing samples must exist before collection. The shared reference now explicitly permits project-approved first collection or diagnosis to obtain those samples. A follow-up with the same agent distinguished permission to collect from proof of complete coverage. This follow-up is not an independent second evaluation.

These observations establish that the text can produce the intended decisions in the supplied scenarios. They do not establish compliance during a real multi-day ticket, fewer retries, elapsed-time savings or improved acceptance outcomes. Later tickets still need observation.

## Retained records

- `notes.md` records the objective, evidence, proposal, task identity and advisor limitation.
- `tests.txt` records the final passing suite.
- `check.txt` records the aggregate check failure.
- `skill-validation.txt` records the generic validators and advisory analyses.

No large test environment or extra dependency was created. Temporary baseline output was removed after its result was recorded here.
