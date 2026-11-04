---
name: domain-modeling
description: Builds and sharpens a codebase's domain model by challenging terms and writing GLOSSARY.md entries and ADRs. Use when actively changing that model, such as resolving codebase terminology, writing or editing a codebase GLOSSARY.md, or recording or editing an ADR. Not for merely reading GLOSSARY.md for vocabulary, or for non-software glossaries.
---

# Domain Modeling

Challenge terms, invent edge-case scenarios, and write glossary entries and decisions down the moment they crystallise.

## File structure

Most repos have a single context:

```
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

A root `GLOSSARY-MAP.md` means multiple contexts and points to where each lives. Infer the topic's context; if unclear, ask:

```
/
├── GLOSSARY-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── GLOSSARY.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── GLOSSARY.md
│       └── docs/adr/
```

Create files lazily: only when you have something to write. If no `GLOSSARY.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `GLOSSARY.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update GLOSSARY.md inline

When a term is resolved, update `GLOSSARY.md` right there. Use the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md).

`GLOSSARY.md` should be totally devoid of implementation details. Do not treat `GLOSSARY.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Offer to create an ADR only when the decision meets all three criteria in [ADR-FORMAT.md](./ADR-FORMAT.md) (hard to reverse, surprising without context, a real trade-off). Read that file before offering one, and use its format and numbering.

## Finish

When the discussion ends, check the glossary and ADR entries you touched for conflicting definitions, terms placed in the wrong context's `GLOSSARY.md`, and duplicate ADR numbers. Correct what you can once and recheck the corrected entries against the same checks. Then list the glossary terms and ADRs written or changed, and any conflict left unresolved.
