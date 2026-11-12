---
name: improve-codebase-architecture
description: Scans a codebase for deepening opportunities (shallow modules worth consolidating), presents them as a visual HTML report, then explores the candidate the user picks through a grilling interview. Use for architecture reviews and refactoring surveys aimed at testability and AI-navigability. Not for reviewing a specific diff (use code-review), implementing an already chosen refactor, or editing the glossary or ADRs alone.
---

When delegation is authorized, start each subagent with a fresh context window and pass a bounded brief instead of inheriting the conversation.

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities**: refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

Load each required skill through the host's skill tool, or read its discovered
`SKILL.md` if no skill tool is exposed. Report an unavailable required dependency.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Load `codebase-design` for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use these terms exactly for architectural roles, and don't drift into "component," "service," "API," or "boundary." Exact domain names, code identifiers and quoted project terms keep their own spelling, even when they contain those words.
- The domain language in `GLOSSARY.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## Process

### 1. Explore

**Scope before you scan: YAGNI.** Deepening a module pays off in future changes to it, so weight recently changed code. Decide *where* to look before you look:

- If the user named a direction (a module, a subsystem, a pain point), take it, and skip the inference below.
- Otherwise, rank files by how often recent commits touched them (`git log --since=6.months --name-only --format= | grep -v '^$' | sort | uniq -c | sort -rn | head -30`) to find the codebase's hot spots, and let those paths pull your attention first. If the list is empty or the changes are scattered with no clear hot spot, widen the range (for example `--since=2.years`). Without a git repo or usable history, ask the user for a direction, or scan the top-level source directories and say so in the report.

Read the project's domain glossary (`GLOSSARY.md`) and any ADRs in the area you're touching first.

Then use an available subagent to explore the selected scope when host instructions permit it; otherwise explore that scope locally. Use these questions as signals, not rules, and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow**, with an interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** from `codebase-design`: if removing a module makes complexity disappear, it may be a needless pass-through. If that complexity reappears across callers, the module hides useful behavior. Propose a deepening only when you can show how the changed interface reduces what callers must know.

### 2. Present candidates as an HTML report

Write a single HTML file, which loads Tailwind and Mermaid from CDNs (needs network to render), to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user (`xdg-open <path>` on Linux, `open <path>` on macOS, `cmd /c start "" "<path>"` or PowerShell `Start-Process "<path>"` on Windows) and tell them the absolute path.

The report uses **Tailwind** for layout and styling, and **Mermaid** for diagrams where a graph/flow/sequence reliably communicates the structure. Mix Mermaid with hand-crafted CSS/SVG visuals: use Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), and hand-built divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

Render one card per candidate with the fields in the **Candidate card** section of [HTML-REPORT.md](HTML-REPORT.md).

End the report with a **Top recommendation** section: which candidate you'd tackle first and why. If no justified candidate exists, report that result and stop without inventing a refactor.

**Use GLOSSARY.md vocabulary for the domain, and the `/codebase-design` vocabulary for the architecture.** If `GLOSSARY.md` defines "Order," talk about "the Order intake module," not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007, but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

Read [HTML-REPORT.md](HTML-REPORT.md) before writing the file: it holds the scaffold, card schema, diagram patterns, escaping rule and styling guidance.

After writing the file, re-read it and check that each card shows all its fields, and re-read each Mermaid block for syntax. Then, when a browser tool (or an already-installed headless browser or Mermaid parser) is available, inspect the rendered report once: the scripts loaded, every Mermaid diagram rendered, and every card shows its before/after diagram. Make one repair pass for any fault. Without such a tool, or without network, state that the render check was not run, give the path, and ask the user to confirm every diagram rendered. Name any fault that remains before asking for a selection.

The report shows each candidate's responsibilities and what callers must know; leave concrete signatures until the user picks a candidate. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, load `grilling` to walk the decision tree with them: constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize; load `domain-modeling` to keep the domain model current as you go:

- **Naming a deepened module after a concept not in `GLOSSARY.md`?** Add the term to `GLOSSARY.md`. Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `GLOSSARY.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing; skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Load `codebase-design` and follow its design-it-twice reference, using its local fallback when delegation is unavailable.

The loop ends when the user settles the deepened module's shape, rejects the candidate (after the ADR offer, if one applies), or declines to continue. Summarise the outcome and any `GLOSSARY.md` or ADR changes made; when a shape is settled, name the deepened module's interface, its seam, and the tests that survive.
