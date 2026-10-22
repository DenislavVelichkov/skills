# Verification skill refinement

Advisor task ID: 5df0b49005064e4f8b8332a5a8192661

Objective: change reusable skill behavior for costly verification, generated artifacts, recurring failures and retrospectives. No incident identifiers in normative guidance. Leave the application, installed caches, publishing and runtime acceptance untouched.

Evidence inspected: the referenced chat, the supplied handoff, repository instructions, marketplace ownership, current skills and public docs, invocation metadata, and workflow-contract tests. The checkout was clean on dv8/main-codex at a109f773c9ec5131e6f8c6986507dd036c07da4a. The existing 20 workflow-contract checks passed.

Proposal: keep expensive-run preparation and failure diagnosis in implement/VERIFICATION.md. Replace vague compatibility and failure instructions with observable checks. TDD owns artifact integration tests; review owns passive assessment; retro owns mapping lessons to existing instructions and evaluations. Update public docs and existing instruction-contract tests. Preserve invocation and acceptance rules. Routine changes require no new preparation record.

Scope: shared reference, its implementation loading pointers, TDD, code-review, retro, their public docs, ask-matt routing summary and its public page, and existing workflow-contract tests. No runtime scripts or dependencies are needed.

Challenge to resolve: prevent the new preparation requirement from becoming another costly gate, and allow bounded diagnostics when the failure cannot be reproduced cheaply without authorizing unsafe retries.

Advisor status: no consultation spawned. Full-history forks forbid model/effort overrides and inherited settings cannot be verified against the configured advisor. Continue with local checks and a separate fresh-agent behavior exercise authorized by skill-creator-plus. This exercise is not an advisor review.

Completed: source guidance, six public pages and existing instruction-contract tests updated. The fresh-agent decision exercise covered eleven scenarios; its incomplete-coverage answer prompted a first-collection clarification and a focused follow-up. Final npm test passes all 40 tests. Aggregate version checking and generic explicit-invocation validation remain incompatible with this branch's existing structure. See report.md for the exact limits and retained records. No advisor review, publication or installation occurred.
