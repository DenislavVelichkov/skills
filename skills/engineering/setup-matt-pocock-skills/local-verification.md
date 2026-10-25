# Local verification

Adapt this seed to the repository's actual tools and recorded user choices.
Replace command placeholders before claiming setup is complete. Link equivalent
existing guidance instead of duplicating it.

## Commit checks

Record the installed hook, activation command and manual check command here.
Reuse an existing hook manager or Git hook. Preserve existing hooks and an
explicit `core.hooksPath`; inspect shared worktree configuration before changing
it. Keep an idempotent repository-owned installation command.

Default to blocking, offline checks of the staged candidate:

- Run the existing linter on affected staged source using installed tools.
- Validate relative documentation links and local image targets against the
  Git index. Include unchanged referring documents when a target is renamed or
  deleted. Honor reference-style links, URL escaping and literal code examples.
- Use staged file bytes. A clean working copy cannot hide a bad staged version;
  partial staging, spaces in paths and subdirectory invocation must work.
- Keep the index and worktree unchanged. Report a missing tool or unsupported
  staged configuration as a failure with a concrete repair command.

Record how generated documentation, link fragments and exceptions are handled.
Validate statically resolvable fragments where supported; state dynamic or
external link coverage precisely. Offline checks do not establish the health
of remote URLs. An exception needs a bounded reason, not a blanket exclusion
for changed files or an automatic fallback to working-copy content.

Use the repository's existing staged checker where it meets this contract.
Prefer a small native Git hook when no hook manager exists. Add a dependency
only when installed tools cannot cover a required case. Commit checks must not
install packages, build applications, start services or launch emulators.
Type checks, full tests and native journeys remain explicit required workflow
checks. Preserve a local-only choice; hosted CI/CD needs its own authorization.

## Review before visual approval

For an applicable visual parity action, follow the
[visual fidelity review](visual-acceptance.md#visual-fidelity-review) before
requesting approval. Link these judgement criteria from the existing review
guidance. Keep mechanical layout regressions in focused checks. Existing
visual acceptance and exact human approval remain required; automated checks
cannot accept a candidate.

## Short native checks

For repositories with native UI, use the existing runner for a short check of
affected ordinary navigation, text entry, installed font assets and large-text
reachability before a long journey. Select cases from the changed boundary;
record what passed and stop on a failed prerequisite. A short check does not
replace final registered journeys or establish unrelated acceptance criteria.

Use the selected device architecture for local builds. Respect the project's
emulator launch profile, including headless operation when requested. Preserve
required failure evidence while cleaning owned temporary resources.

## Verification and recording

Separate checking retained evidence from creating or refreshing a receipt.
Default verification to read-only operation; require an explicit recording
command for writes. Rechecking unchanged inputs must leave tracked bytes and
the index unchanged. Record a new observation only when an observation occurs.

Reuse evidence only when the existing verifier establishes relevant source,
build/dependency, observer, configuration, reference and evidence identity.
Honor transitive dependencies and stricter project gates. Keep the recorded
capture revision truthful; a documentation edit does not authorize relabeling
an earlier run. Preserve immutable historical receipts.

## Current progress

Keep one compact current checkpoint with the scope, latest verified result,
remaining blocker, next action and links to retained evidence and history.
Archive historical narrative without deleting evidence or breaking existing
links. Preserve required progress fields, tracker updates and closure gates.

Read selected fields and bounded file ranges. Summarize command outcomes;
retain complete useful logs in the project's temporary or evidence directory
and link them when needed. A repeated check of unchanged inputs needs a new
reason such as a failure, an edit or an unresolved applicability question.
