# Proportionate verification

Evidence supports a particular claim under particular inputs. A new commit
does not by itself change every claim. Before repeating work, identify the
changed input and the evidence it can invalidate.

## Choose the check

- Record the changed behavior, affected dependencies, smallest useful check,
  and required final checks in the existing ticket or progress record. Use the
  current test runner and proof controller; add no separate tracking system.
- During editing, prefer focused desktop tests through the highest existing
  component, service, or controller boundary that exposes production behavior.
  Replace external systems only at established test boundaries. Extract embedded
  business logic only when a meaningful behavior test cannot otherwise reach it;
  extract the minimum needed, without creating a parallel test model.
- For native UI rendering, font metrics, wrapping, scroll reachability, gestures, rotation,
  lifecycle, platform dialogs, and accessibility focus, select a focused native
  check on the affected profile. Record why a native-only case has no useful
  desktop check. Browser rendering, component mocks, and captured hierarchy
  replay support diagnosis but cannot certify native behavior. Confirm a native
  interaction fix on the affected profile after its desktop regression passes.
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

## Separate reports from execution

- Keep audits, refresh plans and visual reviews passive. They inspect retained
  evidence and report missing or stale proof; only an explicit validation
  operation starts live interactions. A passive report cannot grant acceptance.
- Within one supported operation, execute each required expensive scenario once
  per profile and relevant input state. Let prerequisite checks and finalization
  consume the same verified assessment through the project's existing controller.
  Check source, contract, receipt and observer compatibility before native work
  or rate-limit waits. Unsupported proof remains a named verification gap.
- Reuse requires fresh checks of the relevant build, environment, fixture and
  native state. Mutation, drift, failure, interruption or a review pause expires
  affected live assessments. Restoring bytes or holding a lease alone cannot
  revive them. Retain valid captures and reviews across operations; obtain only
  the fresh proof required by the verifier. Never add an ad hoc acceptance cache.
- For shared fixtures, distinguish an old client projection before ordinary
  entry from a failed fresh observation. Establish the expected state through
  the existing entry path, verify the resulting server and native state, and
  reject later drift before reuse. Preserve fixture cleanup and serialization.
- On failure, diagnose the failed stage and run its smallest supported check
  before another broad run. Record actual scenario executions, assessment reuse,
  invalidations and failures, including failed operations. Measure prerequisite,
  capture, validation, recovery and human waiting separately; screenshot reuse
  alone does not demonstrate less end-to-end work or a ticket speedup.

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
