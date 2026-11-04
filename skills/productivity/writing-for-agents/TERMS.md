# Terms

The definitions and reasoning behind the rules in [`SKILL.md`](SKILL.md). Read it when a rule's term is unclear or you must explain why a rule holds; the rules themselves live in `SKILL.md`.

## Context pointer

A reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in `AGENTS.md` naming a doc is the same object. A must-have target behind a weakly worded pointer is a variance bug. A pointer does two jobs: state what the material is, and list the **branches** that should trigger reaching it. A branch is a distinct case the document handles, so different runs take different paths through it.

## The two loads

- **Context load** is the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every turn, spending tokens and attention whether or not it fires.
- **Cognitive load** is the cost on the human: which documents exist and when to reach for each. The human is the index.

Material reached only through a pointer escapes context load at the price of the pointer's own line; material with no pointer at all rides entirely on cognitive load.

## Information hierarchy

A document is built from **steps** (the ordered actions the agent performs) and **reference** (definitions, rules, facts consulted on demand), mixed freely. The hierarchy is a ladder ranked by how immediately the agent needs the material: in-file step, in-file reference, disclosed reference (a sibling file or an external reference any document can point at). Push too little down and the top bloats; push too much and you hide material the agent needs.

- **Progressive disclosure** is the move down the ladder, behind a pointer, so the top stays legible. It protects the hierarchy more than it saves tokens. When a document has steps, in-file reference that should be disclosed buries them and turns attending to them into a coin-flip.
- **Co-location** decides what sits beside a piece once its rung is chosen. Grouped material brings its neighbours with it. It differs from duplication: duplication repeats one meaning in two places; scattering fragments one meaning across many.
- **Sprawl** is a document simply too long, even when every line is live and unique: attention thins across the excess.

## Completion criteria

- **Premature completion** is ending a step before it is genuinely done. The **post-completion steps** (the visible steps still ahead) pull attention toward being done; a clear criterion is the resistance, and hiding the later steps is the fallback.
- **Demand** drives **legwork**: the digging the agent does within the work, latent in the wording rather than written as its own step. It binds flat reference as well as a sequence, which is how an all-reference document still carries an exhaustiveness bar. The strongest criteria are both checkable and exhaustive.

## Leading word

A compact concept already in the model's pretraining that the agent thinks with while running the document (_lesson_, _fog of war_, _tracer bullets_). Repeated as a token, it accumulates a distributed definition and anchors a region of behaviour in few tokens by recruiting priors the model already holds. It anchors twice: in the body, _execution_ (the agent reaches for the same behaviour each time the word appears, and in flat reference it focuses attention on a class of thing to look for); in a pointer, _invocation_ (shared language across prompts, docs and code links the agent to the material more reliably).

## Negation

Steering by prohibition drags the forbidden behaviour into context: the negation is a weak modifier the strongly activated concept overruns, so the ban half-reads as an instruction to do the thing.

## Pruning terms

- **Duplication** costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank.
- A document that restates the environment is a **cache**: a copy of a lookup, earning its load only when the lookup is expensive.
- **Sediment** is stale layers that settle because adding feels safe and removing feels risky. Shorter documents are easier to keep relevant.
- A **no-op** test is model-relative, not reader-relative: two people disagreeing about a no-op disagree about the model's default.
