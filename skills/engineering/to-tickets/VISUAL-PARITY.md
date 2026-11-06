# Visual parity action

Read this only when the source contains a visual parity action, as defined in
step 1 of SKILL.md.

## Planning prerequisite

Read `docs/agents/visual-acceptance.md` completely. Before exploring,
drafting, or quizzing the user about implementation tickets, locate the
initiative manifest. If it is missing or invalid, create or repair it from the
installed template and the source decisions, following the protocol's Planning
prerequisite. Add one truthful `planned` row per in-scope surface and follow
the protocol's bounded validation and correction step. Report missing protocol
assets, source inputs, or a persistent validation failure before dependent
work. Do not draft, quiz, or publish any tickets until the validator passes. The
gate is the installed manifest validator, `scripts/validate-visual-acceptance.mjs`;
if that script is missing, stop and tell the user to run `/setup-matt-pocock-skills`.
Never invent references, hashes, state transitions, or approval.

## Slices

- Setup installs `scripts/validate-visual-acceptance.mjs`, which already checks
  the manifest and its references, candidates and baselines, so no
  validation-setup slice is needed while it is present. Add one only when the
  source requires a check that script does not perform; that slice is separate
  work and does not gate drafting (the installed validator does).
- For every row still at `planned`, create a blocking design-selection ticket
  that freezes durable references and advances the row to `design_selected`.
  The corresponding implementation-and-acceptance ticket depends on it; the
  implementation agent does not make that design decision. Use the configured
  `ready-for-human` state when a human selection is still required; otherwise
  the evidence-freezing work may be `ready-for-agent`.
- Create one implementation-and-acceptance ticket per manifest surface. Keep
  the surface ticket open through candidate comparison, explicit human
  approval, and baseline promotion.
- Default to a linear chain in manifest order so the next surface stays blocked
  until the previous one is `baseline_promoted`. Use another order only when
  the human explicitly approves it.
- Put the manifest path and surface id in the ticket. Acceptance criteria must
  require exact reference/candidate comparison, explicit approval bound to the
  candidate-set hash, and promoted baselines that match the accepted bytes.
- Require early rendered comparisons on the affected platform, feasible shared
  corrections before final review/capture, and annotated comparison HTML with
  numbered difference pointers. Follow the existing
  [visual sequence](../implement/VISUAL-PARITY.md) and the project protocol's
  "Comparison presentation" through its actual producer and consumer.
- Retain the applicable platform proof and required final coverage. Browser work
  adds no native-only proof requirement. Keep a complete native parent only when
  the project requires it; focused diagnostics replace no final evidence.
- Never let green tests or a clean review satisfy the human-approval criterion.
