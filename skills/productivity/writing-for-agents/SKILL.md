---
name: writing-for-agents
description: Guides writing documents an agent consumes. Use when creating or editing a skill, an AGENTS.md or CLAUDE.md, or a reference doc an agent reaches by a pointer. Not for human-facing docs such as READMEs or user guides.
---

Reference for writing any document an agent consumes: a skill, an `AGENTS.md` / `CLAUDE.md`, a doc reached by a pointer. The aim is predictability: the agent takes the same _process_ every run, not the same output. When the document is a skill, also read [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) for the `description` and invocation choice, splitting by invocation, and router skills. When you need the definition or reasoning behind a term used here (context pointer, the two loads, information hierarchy, premature completion, leading word, sediment), read [`TERMS.md`](TERMS.md).

## Checklist

Check the draft against every item. The sections below say how to fix a failing item.

- Every step ends on a checkable completion criterion.
- Every pointer names its target, which exists, and the branches that reach it.
- Material only some branches need sits behind a pointer.
- Each meaning lives in one place, and nothing restates a cheap environment lookup.
- Each prohibition is paired with its positive target.

When an item fails, make one focused revision and recheck. If it still fails (a pointer target that does not exist, a criterion that cannot be made checkable, a requirement the host does not support), report the unresolved items and do not call the document ready.

## Pointers

A **context pointer** names out-of-context material and the condition for reaching it: a skill's description, or an `AGENTS.md` line naming a doc. Its wording, not its target, decides when and how reliably the agent reaches the material.

- First confirm the target exists and the agent can read it; then sharpen the wording; inline the material only if sharpening fails.
- State what the material is and list the **branches** that should reach it (a branch is a distinct case the document handles).
- Front-load the leading word.
- One trigger per branch: collapse synonyms that rename one branch.
- Cut identity the body already carries. An always-loaded pointer costs on every turn, so prune it harder than the body.

## Placement

- Spend **context load** (always-loaded material) only on what the agent needs every turn. Spend **cognitive load** (the human remembering which documents exist and when to reach for each) where human judgement matters, and remove it where it does not: it is the price of human agency, not a cost to minimise.
- Place each piece on the **information hierarchy**: in-file steps, then in-file reference consulted on demand (a flat peer-set of rules is fine), then disclosed reference in a separate file behind a pointer.
- Inline what every branch needs; push behind a pointer what only some branches reach. Check: no step is buried under reference that only some runs need.
- Keep a concept's definition, rules and caveats under one heading. Check: the document reads like documentation written for the agent.
- When a document is too long even with every line live, disclose reference and split by branch or sequence so each path carries only what it needs.

## Steps and completion criteria

- End every step on a criterion the agent can check, done versus not-done. Replace a vague bound ("understanding reached") with an observable one.
- Set the demand the work needs: "every modified model accounted for" forces thorough work where "produce a change list" does not; "every rule applied" sets the same bar for flat reference.
- Sharpen the criterion first. Only if it stays fuzzy _and_ you observe the agent rushing toward later steps, split the sequence so those steps are out of view. That works only across a real context boundary (a hand-off or a subagent dispatch); an inline call clears nothing.

## When to split

Splitting spends one of the two loads, so split only when the cut earns it:

- **By sequence**: where the later steps tempt the agent to rush the current one. Merging sequences has the reverse effect.
- **By invocation**, skill-specific: see [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Leading words

- Find a triad or a sentence that gestures at one idea at several sites, and replace it with one pretrained word the agent thinks with: "fast, deterministic, low-overhead" → _tight_. Prefer an existing word; a coined word must be defined and recruits no priors.
- Repeat the word as a token, never as a sentence, in the body and in pointers, and use the same word in your prompts, docs and code.
- Keep the explicit criterion beside a word that does not define what must pass: "a loop you believe in" → _red_ only with its check (the loop fails on the bug, or it doesn't).
- Keep a leading-word refactor only when a comparison run (see Pruning) shows the same or better behaviour.

## Negation

- Rewrite a prohibition as the positive target behaviour ("write one-line comments"); a prohibition makes the banned behaviour more available, not less.
- Keep a prohibition only as a hard guardrail you cannot phrase positively, and pair it with the positive target. A "Not for X" exclusion in a description is such a guardrail: keep it next to the positive "Use when" trigger.
- Check: every remaining prohibition has its positive target beside it.

## Pruning

- Keep each meaning in a **single source of truth**, so a behaviour change is a one-place edit; delete duplicates. (A leading word repeats a token on purpose, never the meaning.)
- Leave one-file, one-command lookups (`package.json` scripts, config files, the directory layout, `--help` output) to the environment. Write down only what looking cannot find: the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- Delete each line that no longer bears on what the document does: mere exposition, a branch that should be disclosed, or a stale description of changed behaviour.
- Delete **no-ops** sentence by sentence: instructions the model already obeys by default. Delete the whole sentence, not words from it. A leading word too weak to beat the default (_be thorough_) is a no-op; replace it with a stronger word (_relentless_).
- Settle a disputed no-op or leading word by test, not debate: run the old and new versions on the same prompt and compare the steps the agent takes.
