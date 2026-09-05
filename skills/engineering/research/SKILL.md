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

The researcher's job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
