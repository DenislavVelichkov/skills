---
name: codebase-design
description: Provides shared vocabulary for designing deep modules and designs one module at a time. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary. Not for a codebase-wide survey and HTML report (use improve-codebase-architecture) or for ordinary code review.
---

# Codebase Design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language and these principles wherever code is being designed or restructured.

## Glossary

Use these terms exactly: don't substitute "component," "service," "API," or "boundary."

**Module**: anything with an interface and an implementation. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. _Avoid_: unit, component, service.

**Interface**: everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (too narrow, they refer only to the type-level surface).

**Implementation**: what's inside a module, its body of code. Distinct from **Adapter**: the same adapter role can be filled by a large implementation (a Postgres repo) or a small one (an in-memory fake). Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth**: leverage at the interface. The amount of behaviour a caller (or test) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_: a place where you can alter behaviour without editing in that place; the *location* at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. _Avoid_: boundary (overloaded with DDD's bounded context).

**Adapter**: a concrete thing that satisfies an interface at a seam. Describes *role* (what slot it fills), not substance (what's inside).

**Leverage**: what callers get from depth. More capability per unit of interface they learn. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth. Change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + a lot of behaviour behind it:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Hidden Behaviour   │  ← Much behaviour per unit of interface
│                     │
└─────────────────────┘
```

**Shallow module** = an interface nearly as complex as the behaviour it hides (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Little Hidden Behaviour        │  ← Just passes through
└─────────────────────────────────┘
```

## Designing one module

1. Read the callers and constraints, and classify the dependencies ([DEEPENING.md](DEEPENING.md)).
2. Place the seam.
3. Write the interface: fewest methods, simplest parameters, invariants and error modes, with more complexity hidden inside.
4. Check it against representative callers and list the tests at the interface.
5. Return the interface, seam, tests, and unresolved decisions. Optionally design it twice (below).

## Principles

- **Depth is a property of a module, judged at its interface, not by implementation size.** A deep module can be internally composed of small, mockable, swappable parts; they just aren't part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.** By default, test caller-visible behaviour through the same seam callers cross. A focused test through an internal seam is fine for implementation detail, but if you need to test *past* the interface to check caller-visible behaviour, the module is probably the wrong shape. Accept dependencies instead of creating them, return results instead of producing side effects, and keep the interface small so tests need little setup.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam unless something actually varies across it.

## Relationships

- A **Module** has exactly one **Interface** (the surface it presents to callers and tests).
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as a ratio of implementation lines to interface lines**: rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow: interface here includes every fact a caller must know.

## Going deeper

- [DEEPENING.md](DEEPENING.md): dependency categories, seam discipline, and replace-don't-layer testing.
- [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md): parallel sub-agents design radically different interfaces, compared on depth, locality, and seam placement.
