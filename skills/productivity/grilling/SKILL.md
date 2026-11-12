---
name: grilling
description: Grills the user relentlessly about a plan, decision, or idea through rounds of questions. Use when the user wants to stress-test their thinking or says "grill me", "grill this", or "grill me on". Not for a brief critique or an ordinary code review unless the user asks to be interviewed.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Carry settled scope, authorization, design choices and test boundaries into the
tree. Ask only about consequential unresolved decisions, each with a
recommendation. Decide routine implementation choices yourself from evidence.
Do not re-ask decisions already settled for this scope.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer; when the body lists choices, name the recommended one in the question (e.g. "Go with B?").

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a read-only sub-agent with a fresh context window to find it, or look it up yourself read-only when sub-agents are unavailable or not authorised; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The consequential unresolved _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. An explicit interview ends with a confirmation: state the agreed scope and each settled decision, and ask the user to confirm. When another skill invoked grilling, return that record to the invoking skill instead of asking for confirmation, and finish without reopening settled choices. If the user asks to stop early or declines to continue, stop asking. Summarize the decisions settled so far, then list the consequential decisions still unresolved and what each one blocks. During already-authorized implementation, new questions pause only dependent work; they do not reopen settled approval or authorize new scope.
