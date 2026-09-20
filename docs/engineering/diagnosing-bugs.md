## What it does

`diagnosing-bugs` runs a six-phase diagnosis on a hard bug or a performance regression: build a repro, minimise it, rank hypotheses, instrument, fix with a regression test, clean up.

Start with the supplied error, owning code and smallest existing check. If these
establish the cause, fix and verify it directly. Use the six-phase loop when the
cause remains uncertain or the failure recurs. A **tight** loop exposes the actual
failure and lets the agent test causes; constructing a new runner is unnecessary
when an existing reproduction does that.

Validation follows the behavior being changed. Existing desktop tests provide
feedback during editing; platform-owned behavior needs focused native checks.
Required final proof still runs on the stable candidate.

## When to reach for it

Type `/diagnosing-bugs`, or the agent reaches for it on its own when a task fits: it is model-invoked, and fires on "diagnose" / "debug this" or on a report that something is broken, throwing, failing, or slow.

Reach for it on the hard ones: a bug that resists a first look, an intermittent flake, a regression that crept in between two known-good states. It is heavy by design, and the wrong tool for a question you want answered in one message.

| Your situation | Where to go |
| --- | --- |
| A specific defect you can describe as a symptom | This skill |
| A slow endpoint or a timing regression with a known before-and-after | This skill: it has a performance branch (measure a baseline, then bisect) |
| "Where are the bottlenecks in this codebase?", no specific symptom | Not this skill. It diagnoses one known failure, it does not audit |
| A raw bug report from someone else, not yet confirmed or written up | [triage](https://aihero.dev/skills-triage) first |
| Throwaway code to answer a design question, not chase a defect | [prototype](https://aihero.dev/skills-prototype) |
| Building a planned behaviour test-first | [tdd](https://aihero.dev/skills-tdd) |
| No good seam exists to lock the bug down | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture): this skill hands off there itself |

## The tight loop is the skill

Reuse an existing reproduction first. When none exposes the failure, choose the smallest applicable check from this ladder:

1. A failing test at whatever seam reaches the bug.
2. A curl or HTTP script against a running dev server.
3. A CLI invocation with a fixture input, diffed against a known-good snapshot.
4. A headless browser script asserting on DOM, console, or network.
5. A replayed capture: a saved request, payload, or event log, run through the code path in isolation.
6. A throwaway harness: a minimal subset of the system, one function call.
7. A property or fuzz loop, for "sometimes wrong output".
8. A bisection harness you can hand to `git bisect run`.
9. A differential loop: same input, old version against new.
10. A [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) bash script, last resort. The skill ships `scripts/hitl-loop.template.sh` for this: the agent runs the script, you follow prompts in your terminal, and your answers come back as parseable output.

Stop improving the loop once it distinguishes the candidate causes reliably.
Native and external-service checks can take minutes when those systems own the
behavior. For intermittent failures, use bounded trials and reassess the evidence
before running another batch. General runner improvements remain separate work.

When it genuinely cannot build one, it is instructed to stop and say so, list what it tried, and ask you for [environment](https://www.aihero.dev/ai-coding-dictionary/environment) access, a captured artifact, or permission to add temporary instrumentation. It should not proceed to hypothesise anyway.

## The gates between phases

The phases are gates, not a checklist. Each one refuses to open until something specific is true.

| Gate | What has to be true |
| --- | --- |
| Into Phase 2 | A named command, already run and pasted with its output, that can go red on this bug |
| Into Phase 3 | The smallest supported reproduction isolates the behavior enough to test competing causes |
| Into Phase 4 | 3–5 ranked, falsifiable hypotheses exist, each stating its prediction, shown to you before any is tested |
| Into Phase 5 | Probes map to a specific prediction, one variable at a time, every debug log tagged `[DEBUG-a4f2]`-style so cleanup is one grep |
| Done | Original repro no longer reproduces, instrumentation gone, and the hypothesis that turned out correct is written into the commit message |

Phase 5 has an escape hatch worth knowing about. The regression test is written before the fix, but only if a **correct seam** exists for it: one where the test exercises the real bug pattern as it occurs at the call site. Where the only available seam is too shallow, the skill is told to say so rather than write a test that gives false confidence. That absence is itself the finding, and it is what routes the post-mortem to `improve-codebase-architecture`.

## Common questions

**It fires on quick questions where I just wanted a direct answer.**
This fork starts with the error, relevant code and an existing check. A clear
cause can receive a direct fix or explanation; the full loop is reserved for
uncertain, recurring or measured performance failures. It should not build a
mock reproduction merely to answer a straightforward question.

**Can I point it at a codebase and ask where the performance problems are?**
No. It diagnoses one failure you can already name. Its performance branch is for a regression with a symptom (establish a baseline measurement, then bisect, measure first and fix second), not for a proactive sweep. A skill for the proactive version was [proposed and closed](https://github.com/mattpocock/skills/issues/431); there is currently no skill for it.

**Does it stop and ask me before it writes the fix?**
No. Only Phase 3 has a human checkpoint: the ranked hypothesis list is shown to you before any is tested, and it proceeds on its own ranking if you are away. There is no gate between instrumentation and the fix, so the agent can start writing code before you have agreed with its root cause. [Issue #124](https://github.com/mattpocock/skills/issues/124) asks for that gate and is still open. If you want it, say so when you invoke the skill.

**I already ran `/triage` on this bug report. Is this the same work again?**
Partly, and neither skill admits it. As one reader put it: "Triage's step 3 is essentially a shallow, bounded instance of diagnosing-bugs Phase 1–2, but neither file mentions the other." Triage does a bounded "is this actually a bug, and what is the surface" pass; this skill does the thorough version. Running triage first is not wasted (its verification often gives you most of Phase 1's raw material), but expect to redo it properly here, and expect no cross-reference to tell you that.

**Will the repro output it pastes leak secrets?**
It might. The skill asks the agent to paste the invocation and its output, and to request artifacts like HAR files, log dumps, and core dumps. None of those are sanitised by instruction. [Issue #674](https://github.com/mattpocock/skills/issues/674) raises exactly this (credentials, tokens, cookies, and personal data riding along into a chat, an issue, or a PR) and proposes a redaction guardrail. It is open and unimplemented. Treat redaction as your job for now, particularly before the output goes anywhere public.

**My security scanner flagged this skill as high risk.**
Snyk flags it, and the flag is a false positive. It is the only skill in the set that ships an executable shell script (`hitl-loop.template.sh`) alongside instructions to run it and to curl a dev server. Shipped `.sh` plus run-it instructions plus outbound HTTP is enough to trip a static scanner. The script itself is about 30 lines of `read -r -p` prompts that pause for human input. The scanner is rating the capability surface, not a proven exploit.

**What happened to `/diagnose`?**
Renamed to `/diagnosing-bugs` in v1.0.0. The old name no longer exists. Anything of yours that chains `/diagnose` (a wrapper skill, a saved prompt) needs updating.

## It's working if

- It shows you a command and its red output before it offers a single theory. If theory arrives first, the skill is not running.
- The failure it reproduces is the one you reported, not a nearby one it found on the way.
- It shrinks the repro before it starts guessing, and can tell you why each remaining piece is load-bearing.
- You are shown a ranked list of 3–5 hypotheses, each with a prediction you could falsify, before any of them is tested.
- Every debug log it adds carries a tag like `[DEBUG-a4f2]`, and a grep for that tag comes back empty when it declares done.
- The commit or PR message names which hypothesis was right.
- When it cannot lock the bug down with a test, it says so plainly instead of writing a shallow one.

## Where it fits

`diagnosing-bugs` is a reach-for-it-anytime standalone. You drop into it when something is broken and drop out when the fix and its regression test are in; it holds no state and needs no prior setup. [ask-matt](https://aihero.dev/skills-ask-matt) routes "Something's broken" here.

Two neighbours matter. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) takes the [handoff](https://www.aihero.dev/ai-coding-dictionary/handoff) when the real finding is that the code has no seam to lock the bug down; the recommendation is made after the fix is in, when there is more information. [triage](https://aihero.dev/skills-triage) sits upstream of it for bugs that arrive as raw reports from other people, and does a shallower version of the same first two phases.
