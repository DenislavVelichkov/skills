---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Carry settled scope, authorization, design choices and test boundaries into the
tree. Group only consequential unresolved decisions with recommendations;
resolve routine implementation choices from available evidence. A prior answer
for the same scope does not need confirmation again.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. Look up facts from the environment yourself. Delegate only with explicit user
authorization and available tools, announcing the reason first. Pending research
blocks only dependent questions; ask the remaining frontier now. Material
unresolved decisions belong to the user.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. An explicit interview retains its final shared-understanding confirmation. During already-authorized implementation, new questions pause only dependent work; they do not reopen settled approval or authorize new scope.
