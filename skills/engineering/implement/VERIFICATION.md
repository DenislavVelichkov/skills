# Proportionate verification

Evidence supports a particular claim under particular inputs. A new commit
does not by itself change every claim. Before repeating work, identify the
changed input and the evidence it can invalidate.

## Choose the check

- Record the changed behavior, affected dependencies, smallest useful check,
  and required final checks in the existing ticket or progress record. Use the
  current test runner and proof controller; add no separate tracking system.
- During implementation, run focused behavior tests and relevant type checks.
  Add regression coverage for a real defect at the agreed public boundary.
  Avoid tests that merely repeat implementation details or add no useful
  failure signal.
- Keep tests, runtime proof, native visual proof, accessibility proof, and
  human acceptance distinct. A changed test command can require a new test
  result without requiring a new screenshot. A changed observer or capture
  policy that affects what was observed can invalidate the capture itself.
- Complete a bounded batch of related shared fixes before expensive captures.
  Rerun each affected scenario once on that stable candidate. A subsequent
  relevant edit invalidates the affected result again.
- Run all required final checks on the final candidate. After they pass, stop
  unless a later relevant change, failure, or unresolved concern requires more
  verification. Verification cost is a signal to improve the workflow, not a
  reason to skip a required gate.

## Reuse evidence safely

Reuse is available only when the project verifier supports it and proves
applicability to the current candidate. Preserve the original capture commit,
build identity, artifacts, and receipts; record the new applicability decision
separately. Never relabel an old capture as a new run.

The verifier must check the complete relevant inputs for the claim: direct
and transitive source dependencies, build configuration and toolchain,
assets/fonts, runtime and device profile, fixture state, references, and the
semantics of the proof policy. Compare actual content with the current
candidate. An ancestor commit, unchanged screenshot, or matching file list
alone is insufficient. Unknown dependencies require conservative revalidation.

Choose real module and behavior boundaries for dependency tracking. Omitting
a shared source file, weakening a hash check, or guessing that an edit is
harmless cannot establish evidence reuse. Test-list or reporting metadata
must remain separate from capture inputs when the project supports that
distinction. Until it does, respect the existing validator and report the
specific overbroad dependency as a controller improvement.

For each rerun, name the changed input, affected claim, and selected check.
When developing a controller, cache repeated reads and hashes only within an
immutable candidate or with reliable content invalidation.

## Schedule without repeated work

Plan shared primitives and contract repairs before their consumers' final
evidence. Where the approved project workflow allows it, keep evidence refresh
work separate from feature blocking edges: a stale receipt blocks the affected
acceptance claim, and a broken dependency blocks its consumers. Independent
work can continue. Every required claim must be current before package closure.

Existing serial order, current-source proof requirements, and human approval
rules remain authoritative. Propose an explicit contract amendment when they
prevent this scheduling; do not silently relax them or infer approval from a
timeout. Concurrent work requires authorization and isolated mutable resources.

## Examples to check adoption

- Documentation-only edit outside proof inputs: no native recapture.
- Extra unrelated test: run the test; retain valid visual evidence.
- Shared font change: recapture each affected profile once after the fix batch.
- Incomplete dependency inventory: revalidate the uncertain affected scope.
- Changed candidate bytes or approval-bound inputs: follow the project's
  invalidation and human acceptance rules before claiming completion.
