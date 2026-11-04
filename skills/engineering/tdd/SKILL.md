---
name: tdd
description: Test-driven development (red-green; code-review reports refactoring candidates and the implementer applies accepted ones). Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests written test-first. Not for adding coverage to existing code, prototypes, or diagnosing unknown bugs.
---

# Test-Driven Development

For desktop versus focused native checks, minimum extraction, and complete final
proof, read [proportionate verification](../implement/VERIFICATION.md) before
selecting validation. If that file is missing, use the project's focused test
command and final suite, and report the missing file. Red-green cycles are not
separate delivery or review checkpoints.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

Read [tests.md](tests.md) when you need examples of good and bad tests, and [mocking.md](mocking.md) when a test needs a test double or touches an external service.

For generated artifacts (a codegen output, a built config, an emitted file),
test actual producer output through the actual consumer at the agreed public
boundary:

- Assert a successful consumed result against the contract, then cover
  incomplete and incompatible outputs. A handwritten fixture alone does not
  prove the producer is compatible. Example: generate the OpenAPI client, then
  call it from the app's own loader.
- Check rejection before runtime mutation or ownership acquisition where
  possible; otherwise run in isolated state and assert it is restored.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Reuse boundaries confirmed in the ticket,
spec or conversation; record them without asking again. If a boundary is
unresolved, recommend the public interface that exposes the required behavior,
explain what it catches and misses, and ask for that decision before writing
its tests. Continue work at already-confirmed boundaries.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: expected and actual are the same computation (a constant asserted equal to itself, a snapshot regenerated from the code under test), so the assertion cannot fail.
- **Duplicated expectation logic**: the test recomputes the expected value the way the code does, so a shared mistake passes in both. Prefer expected values from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Baseline first.** Before the first cycle, run the focused tests and record any pre-existing failures as the baseline; don't count them as your red.
- **Red before green.** Write the failing test first and confirm it fails on the intended assertion, not on a setup, import or syntax error (fix those first). If it cannot fail on that assertion (the behavior already exists, or no seam reaches it), stop and report that instead of forcing red. Then write only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Keep feedback narrow.**
  - Run the focused test during red-green.
  - After a meaningful change, run the affected tests and relevant type checks.
  - Run the project's required final suite on the stable candidate; don't replay
    it after unrelated documentation or reporting edits.
  - Reuse a result only while its relevant inputs are unchanged; failures,
    uncertain impact, and project gates can require broader checks.
  - Test results do not substitute for runtime or visual proof.
- **Bounded repair.** If the same test stays red after three focused fix attempts, or the required suite cannot run, stop and report a blocker: the test, the last failure output, what you tried, and what is needed.
- **Refactoring is not part of the loop.** `code-review` reports refactoring candidates after the loop; the implementer applies the accepted ones.

## Done

When used directly: every requested behaviour has a passing test, the project's final suite passes, and you report the tests added and the final suite result.
