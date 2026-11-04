---
name: to-spec
description: "Converts the current conversation into a spec and publishes it to the project issue tracker: no interview, just synthesis of what was already discussed."
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

Reuse tracker configuration already supplied and follow its document pointer
in the current `AGENTS.md` or `CLAUDE.md`. If no alternate path is configured,
read `docs/agents/issue-tracker.md` when present. If no tracker is known, tell
the user to run `/setup-matt-pocock-skills`, keep the drafted spec in your
reply, and stop before publication. A parent spec
needs no triage label mapping because it receives no execution label.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Decide whether the source contains a visual parity action. It does only
when the source requires a named production surface to be compared against a
visual reference, requires selecting and freezing that reference for the later
comparison, or links an existing manifest that records either obligation. UI
work without that obligation uses the normal spec path and no manifest.

For a visual parity action, read `docs/agents/visual-acceptance.md` completely.
If that protocol or its template is not installed, tell the user to run
`/setup-matt-pocock-skills`, report the blocked parity prerequisite, keep the
drafted spec in your reply, and stop before publishing.
Before sketching seams or publishing the spec, locate the initiative manifest.
If it is missing or invalid, create or repair it from the installed template
and the source decisions, following the protocol's Planning prerequisite. Add
one truthful `planned` row per in-scope surface, then use the protocol's bounded
validation and correction step. Do not stop merely because it is absent, and do not invent references,
hashes, state transitions, or approval. Advance a row to `design_selected` only
when the selected durable references and their hashes actually exist.

3. Sketch out the seams at which you're going to test the feature. Prefer existing seams to new ones, and place every seam as high as possible. The fewer seams across the codebase, the better - the ideal number is one.

Reuse seams already confirmed in the conversation or source requirements;
record them without asking again. Ask only for a consequential unresolved seam
decision. This exception does not start another feature interview.

4. Write and publish the spec:
   1. Write it using the template below.
   2. Check it against the source decisions for missing requirements, invented scope, and unresolved choices.
   3. Remove credentials, secrets and incidental private data copied from the conversation, and check who can see the tracker. Correct detected faults once and recheck; label any remaining unknowns explicitly.
   4. Show the draft to the user and wait for confirmation; an unchanged draft they already confirmed needs no second confirmation.
   5. Publish it to the project issue tracker. Publication is complete only when the tracker returns an issue identifier or link (for local markdown, the saved `spec.md` path).
   6. Read the issue back when the tracker allows.
   7. If a create fails or its result is uncertain, check for an existing issue with the same title before one retry; if it still fails, report the failure and keep the draft in your reply.
   8. Do not apply `ready-for-agent` or another execution label to the parent spec. For local markdown, do not add a `Status:` line to `spec.md`.

The spec is ready for ticket splitting, not implementation. End after publishing it, report the issue identifier or path, and tell the user to run `/to-tickets`. Never edit production code or invoke `/implement` from this skill.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A numbered list of the agreed user stories. Each story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Cover each distinct in-scope user outcome once. For architectural work with no
user-facing stories, record its contracts and invariants under Implementation
Decisions and Testing Decisions instead of inventing actors or features.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Visual Acceptance Contract

Include this section only for a visual parity action. Link the manifest,
state that design selection is not production acceptance, name the required
comparison and human-approval boundary, and carry the five progress counters
defined in `docs/agents/visual-acceptance.md`. A `planned` row is valid ticket-planning input but not permission to
edit production code. Do not duplicate its route rows into prose.

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
