---
name: diagnosing-bugs
description: Diagnoses hard, recurring, or unclear bugs and performance regressions. Use for explicit diagnosis/debugging requests or when a focused inspection and existing check do not establish the cause. Not for test-first feature work (use tdd).
---

# Diagnosing Bugs

A discipline for hard bugs. Start with the supplied error, relevant code, and
the smallest existing check. If that evidence establishes a straightforward
cause, make the requested fix, verify the reported symptom, and explain the
cause. A question about an error can end with an evidence-backed explanation.

Use the full loop below when the cause remains uncertain, the bug recurs, or
performance needs measurement. Reuse an existing reproduction before creating
one. Add a regression test when it protects behavior, not merely to repeat the
fix; explicit test-first requests retain their TDD workflow. Within the full
loop, skip a phase only when you state why; Phase 2 minimisation may be skipped
this way when the loop already isolates the failure.

When exploring the codebase, read `GLOSSARY.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Redact

This skill has you show commands, outputs and captured artifacts. **Redact every secret first**: write `<REDACTED>` in its place. Build loops against env vars, so the credential stays in the environment rather than in what you show. Captured artifacts carry auth headers: quote only the lines that carry the signal.

If the redacted output is not enough to diagnose the bug, say so and ask the user.

## Phase 1: Build a feedback loop

A **tight** pass/fail signal that goes red on _this_ bug is what bisection, hypothesis-testing and instrumentation all consume.

Use the smallest existing check that can distinguish the failure from success.
Before adding or repairing a runner, read the tooling boundary in
[proportionate verification](../implement/VERIFICATION.md); it also covers
desktop versus focused native checks and complete final proof. If that file is absent, use the smallest existing check, do not build new runners, and report the missing file. Phase 1 ends when that check exposes the actual failure; further loop
optimization needs a measured obstacle to diagnosing this bug.

### Ways to construct one, in roughly this order

1. **Failing test** at whatever seam reaches the bug: unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) that drives the UI and asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, copy and edit `scripts/hitl-loop.template.sh`, give the user the exact `bash <path>` command to run in their own terminal (it reads keyboard input, so do not run it yourself), and ask them to paste back the `KEY=VALUE` block it prints.

Keep the reproduction scoped to the reported failure.

### Tighten the loop

Improve the loop only when its cost, ambiguity or flakiness prevents the next
diagnostic step. Reuse supported filters and fixtures first. Stop improving it
when the next hypothesis can be tested reliably; broader runner improvements
are separate work. Native or external-service checks may take minutes. Keep
those checks when the platform owns the behavior rather than replacing them
with a faster simulation that cannot prove it.

### Non-deterministic bugs

Choose a bounded trial count and vary one suspected condition at a time. Record
failures and elapsed time, then reassess the evidence before another batch.
Stress and concurrency require authorized, isolated resources. Stop increasing
the reproduction rate once it can distinguish the candidate explanations.

Keep one compact decision record in the existing ticket: the exact symptom,
ranked predictions, trials already consumed, input identities, current result
and the remaining decision. Resuming, changing observers or writing another plan
does not reset that budget. Carry explicit user stop conditions forward.

Matching code hashes do not establish matching generated inputs. Before a
causal comparison, verify the same relevant fixture bytes and starting state,
including generated originals and database state when they affect the symptom.
Reuse one isolated synthetic fixture within the authorized experiment; preserve
required cleanup and never substitute actual user data. If inputs or observer
behavior differ, report a confounded observation rather than a causal result.

A passing diagnostic is a non-reproduction. State which prediction it tests
and which decision its result supports. After the existing re-rank limit is
exhausted, name the exact missing evidence or access and stop; do not propose
another equivalent observation. Routine deterministic fixes need no experiment
record or additional probes.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a redacted captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

### Completion criterion: a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** (a script path, a test invocation, a curl) that you have **already run at least once** (show the invocation and its output, redacted), and that is:

- [ ] **Red-capable**: it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring"; it must be able to _catch this specific bug_.
- [ ] **Deterministic**: same verdict every run (flaky bugs: a pinned reproduction rate able to distinguish the candidate explanations, per above).
- [ ] **Proportionate**: the smallest supported check of the actual behavior; record why a slower native or external-service check is necessary.
- [ ] **Agent-runnable**: you can run it unattended; a human in the loop only via `scripts/hitl-loop.template.sh`, which the user runs and whose output they paste back.

Read the owning code to select the check. Keep suspected causes provisional
until the check provides evidence.

## Phase 2: Reproduce + minimise

Run the Phase 1 loop and watch it go red; wrong bug = wrong fix.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut, and keep only what's load-bearing for the failure.

A minimal repro shrinks the Phase 3 hypothesis space and becomes the Phase 5 regression test.

Done when the smallest supported reproduction isolates the behavior enough to
test competing causes. Preserve necessary platform and integration dependencies;
rebuilding them solely to shrink the reproduction is separate tooling work.

## Phase 3: Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe: discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it; proceed with your ranking if the user is AFK.

## Phase 4: Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Use `rg` to locate that prefix during cleanup.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

**No surviving hypothesis.** If every ranked hypothesis is falsified or the probes give no causal evidence, re-rank once with what the probes showed. If that round also fails, stop and report the remaining uncertainty and the evidence or access needed to proceed. Do not apply a fix without evidence for its cause.

## Phase 5: Fix + regression test

Write the regression test **before the fix**, but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Document it in the Phase 6 report (see the regression-test checklist item) and recommend /improve-codebase-architecture.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail. If you forced the red by mutating code or a fixture, `diff` against a pristine copy to prove the mutation landed before you trust it.
3. Apply the fix.
4. Watch it pass, then complete Phase 6.

## Phase 6: Cleanup

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (search for the prefix with `rg`)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location)
- [ ] The hypothesis that turned out correct is stated in the final report, and in the commit / PR message when one is made
