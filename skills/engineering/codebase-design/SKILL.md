---
name: codebase-design
description: Provides shared vocabulary for designing deep modules and designs one module at a time. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary. Not for a repo-wide architecture review report (use improve-codebase-architecture) or for ordinary code review.
---

# Codebase Design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language and these principles wherever code is being designed or restructured. The aim is leverage for callers, locality for maintainers, and testability for everyone.

## Glossary

Use these terms exactly for the design concepts they define: don't substitute "component," "service," "API," or "boundary." Keep existing domain names, framework terms and quoted interface identifiers (a named `OrderService`) as they are.

**Module**: anything with exactly one interface and an implementation. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. _Avoid_: unit, component, service.

**Interface**: everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (too narrow, they refer only to the type-level surface).

**Implementation**: what's inside a module, its body of code. Distinct from **Adapter**, which names the role a thing plays at a seam, not how much code it holds: a Postgres repository is an adapter with a large implementation, and an in-memory fake is an adapter with a small one. Say "adapter" when the seam is the topic and "implementation" otherwise.

**Depth**: leverage at the interface. The amount of behaviour a caller (or test) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_: a place where you can alter behaviour without editing in that place; the *location* at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. _Avoid_: boundary (overloaded with DDD's bounded context).

**Adapter**: a concrete thing that satisfies an interface at a seam. Describes *role* (what slot it fills), not substance (what's inside).

**Port**: an interface defined at a seam for an injected dependency; adapters satisfy it.

**Leverage**: what callers get from depth. More capability per unit of interface they learn. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth. Change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = much behaviour reachable through a small interface. **Shallow module** = an interface nearly as complex as the behaviour it gives (avoid):

```
Deep                       Shallow (avoid)
┌─────────────────┐        ┌──────────────────────────┐
│ Small interface │        │ Large interface          │
├─────────────────┤        ├──────────────────────────┤
│                 │        │ Thin pass-through        │
│ Deep            │        └──────────────────────────┘
│ implementation  │
└─────────────────┘
```

## Designing one module

1. Read the callers and constraints, and classify the dependencies ([DEEPENING.md](DEEPENING.md)).
2. Place the seam.
3. Write the interface: fewest methods, simplest parameters, invariants and error modes, with more complexity hidden inside.
4. Check it against representative callers and list the tests at the interface.
5. Return the interface, seam, tests, and unresolved decisions. Optionally design it twice (below).

## Principles

- **Depth is a property of a module, measured at its interface, not by its implementation size.** A deep module can be internally composed of small, mockable, swappable parts; they just aren't part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface. Don't expose internal seams through the interface just because tests use them.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The external interface is the behaviour test surface.** Callers and behaviour tests cross the same seam. Use tests at an internal seam only for focused checks of a part the external tests can't reach cheaply. If behaviour tests have to reach *past* the interface, the module is probably the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam or port unless at least two adapters are justified (typically production + test). A single-adapter seam is just indirection.

## Designing for testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them.**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results from calculations; isolate required effects behind adapters.** Writes to a repository or calls to an external service still happen, through an injected adapter rather than inside the calculation.

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area.** Fewer methods and params mean simpler test setup and less coupling. Still test every required behaviour, error mode and edge case.

## Rejected framings

- **Depth as a line-count ratio of implementation to interface**: rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow: interface here includes every fact a caller must know.

## Going deeper

- **Deepening a cluster given its dependencies**, see [DEEPENING.md](DEEPENING.md): dependency categories, seam discipline, and replace-don't-layer testing.
- When comparing alternative interfaces, read [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md). It compares designs on depth, locality and seam placement, using authorized subagents when available or developing the alternatives locally.
