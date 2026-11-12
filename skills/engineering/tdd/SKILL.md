---
name: tdd
description: Guides test-first development in red-green cycles at agreed seams. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor" (refactoring is deferred to review), or wants integration tests written before the code. Not for adding tests to existing code after the fact.
---

For desktop versus focused native checks, minimum extraction, and complete final
proof, read [proportionate verification](../implement/VERIFICATION.md) before
selecting validation or starting a connected batch. Keep red-green cycles inside
that batch; they are not separate delivery or review checkpoints. If that file
is unreadable, follow "Keep feedback narrow" below and report the missing path.

# Test-Driven Development

Apply every section below on every red → green cycle, before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

For generated artifacts, test actual producer output through the actual consumer
at the agreed public boundary. Assert a successful consumed result against the
contract, then cover incomplete and incompatible outputs. Handwritten consumer
fixtures alone do not prove producer compatibility. Check rejection before
runtime mutation or ownership acquisition where possible; use isolated state
and verify restoration when the boundary requires mutation. For example, feed
the real generator's output to the real parser, then assert that the parser
rejects a truncated copy of that file.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Reuse boundaries confirmed in the ticket,
spec or conversation; record them without asking again. If a boundary is
unresolved, recommend the public interface that exposes the required behavior,
explain what it catches and misses, and ask for that decision before writing
its tests. Continue work at already-confirmed boundaries.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), load the available `codebase-design` skill for the vocabulary. It is a reference to consult, not a session to run.

Use the host's skill tool when exposed; otherwise read its discovered
`SKILL.md`. Report a missing dependency instead of claiming it was loaded.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Baseline first.** Before the first cycle, run the focused tests and record any pre-existing failures as the baseline; don't count them as your red.
- **Red before green.** Write the test first and run it before implementing. Confirm it fails because the behavior is missing; fix syntax, setup or unrelated failures first. If the new test passes before any implementation, check whether the behavior already exists or the test is too weak; tighten the test, or record the existing behavior and move to the next slice. If the same failure survives three repair attempts, or the required suite cannot run, stop and report the command, the failure, the attempts and the missing prerequisite.
- **Then green.** Write only enough code to pass the failing test. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Keep feedback narrow.** Run the focused test during red-green. After a
  meaningful change, run the affected tests and relevant type checks. Run the
  project's required final suite on the stable candidate, without replaying it
  after unrelated documentation or reporting edits. Reuse a result only when its
  relevant inputs (the source, tests, config and dependencies the check reads)
  are unchanged; failures, uncertain impact, and project gates can require
  broader checks. Test results do not substitute for runtime or visual proof.
- **Refactoring is not part of the loop.** It belongs to the review stage (see the `code-review` skill), not the red → green implementation cycle.

## Done

The session is done when every agreed behavior has a passing test at its seam and the required final suite passes. Report the tests added, the seam each one exercises, and the final suite result.
