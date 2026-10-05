## What it does

`research` answers a scoped question from
[primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source)
and saves a cited Markdown file in the repo. Official documentation, source
code, specifications and first-party APIs own the facts it reports.

It works in the current agent by default. A permitted background worker can
handle one bounded task while independent work continues; that worker completes
the research itself and does not delegate the same task again.

## When to reach for it

Type `/research`, or the agent reaches for it automatically when a task needs
external facts or documentation.

| What you need | Reach for |
| --- | --- |
| An API fact, version claim or documented behavior | `research` |
| A decision made with you through questions | [grilling](https://aihero.dev/skills-grilling) |
| A design question that needs runnable code | [prototype](https://aihero.dev/skills-prototype) |
| Decisions too large for one session | [wayfinder](https://aihero.dev/skills-wayfinder) |

## Prerequisites

The agent needs access to the relevant sources and a writable location for the
findings. Missing access is reported as an evidence gap.

## Scoped reading

The question determines the stopping point. Existing notes can supply context,
but version-sensitive facts need verification. The file distinguishes sourced
facts from inferences and records contradictions or evidence it could not read.

Before finishing, the skill checks that the file answers the question and its
citations support its claims. It corrects detected faults once and rechecks the
affected claims. It returns the saved path, answer and any unresolved gap.

## Common questions

**Does it always spawn a background agent?**

No. Local research is the default. Delegation requires authorization, available
tools, and independent work that can continue in the coordinator.

**Can the worker spawn another research agent?**

No. The assigned worker completes its bounded research directly.

**Where does the file go, and should I commit it?**

It follows the repo's existing notes convention. Without one, it chooses a
sensible location and reports the path. This skill does not require a commit;
a Wayfinder research ticket has its own branch and context-pointer convention.

**When does it stop reading?**

When available evidence answers the scoped question, or further progress
requires unavailable input or access. A gap stays explicit rather than being
filled with an invented source.

**Does a later session load the file automatically?**

No. Point the later session, spec or ticket at the saved file.

## It's working if

- One cited file answers the question or states the exact evidence gap.
- Following a factual claim's citation reaches the source that owns it.
- Inferences are labeled and conflicting evidence remains visible.
- An authorized worker completes its task without a second delegation.

## Where it fits

`research` is a standalone that supplies facts to
[grill-with-docs](https://aihero.dev/skills-grill-with-docs) and
[to-spec](https://aihero.dev/skills-to-spec). Wayfinder uses it to resolve
research tickets. [ask-matt](https://aihero.dev/skills-ask-matt) routes over the set.
