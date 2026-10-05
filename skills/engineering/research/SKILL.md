---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Research in the current agent by default. When the user has authorized
delegation, you are the coordinator, tools are available, and independent work
can continue locally, delegate one bounded research task to a background agent.
Tell the user why. A research worker completes the assigned research itself;
it must not delegate the same task again. If delegation is unavailable, complete
the research locally.

State the question and its scope from the request before reading. Reuse relevant
existing notes, verifying facts whose version or date matters. If the scope is
too ambiguous to answer, ask for the missing decision while investigating
independent parts.

The researcher's job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs). Follow each factual claim back to its owner; distinguish source facts from your inferences.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
4. Check that the file answers the scoped question, that citations support its
   claims, and that contradictions or inaccessible evidence remain explicit.
   Correct detected faults once and recheck the affected claims.

Stop when the scoped question is answered from available evidence, or further
progress requires unavailable input or access. Return the saved path, the
answer, and any unresolved gap; report missing capabilities instead of inventing
sources or claiming a complete answer.
