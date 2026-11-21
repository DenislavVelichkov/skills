# Visual Acceptance Protocol

## Applicability

Use this protocol only for a **visual parity action**. The source must do at
least one of these:

- require `Compare <production surface> against <visual reference>`
- require `Select and freeze <visual reference> so <production surface> can be
compared later`
- link an existing visual-acceptance manifest that records that obligation

Applicability must precede artifact creation. A proposed manifest path or a
request to create a new manifest does not establish it.

If the source cannot complete either sentence and links no manifest, use the
normal workflow. A UI change, redesign, prototype, screenshot, or visual test
without a production-to-reference comparison creates no manifest and adds no
visual-acceptance gate.

Browser parity adds no native-only proof requirement. Native parity retains
all project-required native coverage, including a complete native parent where
required. Diagnostic images and focused checks replace no final coverage and add
no manifest state or human acceptance gate.

## Invariant

A production screenshot is a candidate, never its own acceptance reference.
Only a human can accept a candidate. Regression baselines are promoted only
after that acceptance is bound to the exact candidate hashes.

Prototype selection means `design_selected`; it never means
`member_accepted`.

## Durable artifacts

Keep one manifest per initiative at:

```text
docs/visual-acceptance/<initiative>/manifest.json
```

Keep approved references, candidate captures, and comparison pages beside it.
Move selected references out of disposable prototype or temporary directories
before the design-selection ticket closes.

Start from [the manifest template](visual-acceptance.template.json). Paths in
a manifest are repository-relative and must not escape the repository root.

## Planning prerequisite

After a visual parity action establishes applicability, a valid manifest must
exist before `to-tickets` drafts implementation tickets and before `implement`
edits production code.
If the manifest is missing or invalid, the skill running that preflight creates
or repairs it before either phase begins. Absence is not a reason to defer the
artifact to implementation.

Create the smallest truthful planning manifest from decisions already present
in the conversation, map, spec, or ticket:

1. Copy the manifest template to
   `docs/visual-acceptance/<initiative>/manifest.json`.
2. Set the initiative and add one `planned` row per known visual surface.
3. Record the route, current selection or `Pending design selection`, required
   visible regions, and known interactions. Start references, candidates,
   deviations, and baselines empty; set comparison, approval request, and
   approval to `null`.
4. Run the validator. Correct source-supported defects in one focused pass,
   then recheck. Follow a project-defined retry limit if one exists. If the
   result is still invalid or required inputs or tooling are missing, preserve
   the truthful manifest, report the exact blocker, and stop dependent work.
   A repeated failure does not authorize invented evidence or relaxed gates.

Use this exact shape for each new `planned` row, replacing every bracketed
value with facts from the source:

```json
{
  "id": "<stable-surface-id>",
  "route": "<route-or-entry-point>",
  "selection": "<known target or Pending design selection>",
  "requiredRegions": ["<visible-region>"],
  "requiredInteractions": [],
  "state": "planned",
  "references": [],
  "candidates": [],
  "comparison": null,
  "deviations": [],
  "approvalRequest": null,
  "approval": null,
  "baselines": []
}
```

A valid `planned` row unlocks ticket drafting, not production implementation.
Implementation of that surface starts only after durable reference files and
their hashes advance it to `design_selected`. When the source already contains
an explicit selection and durable references, record that evidence and advance
the row. Never manufacture a reference, hash, state transition, approval
request, or human approval to satisfy the validator.

## Surface states

Each route or independently accepted surface moves through these states in
order:

1. `planned`
2. `design_selected`
3. `implemented`
4. `compared`
5. `approval_requested`
6. `member_accepted`
7. `baseline_promoted`

The manifest records one row per surface. Each row names the route, selected
option, required regions and interactions, and every reference viewport,
locale, and scenario. Reference files and hashes are fixed at
`design_selected`. Populated fields follow
[Evidence and approval fields](#evidence-and-approval-fields).

## Evidence and approval fields

Digests are `sha256:` followed by 64 lowercase hex characters of the file
bytes. Timestamps are UTC ISO strings in `toISOString()` form
(`2026-01-02T03:04:05.000Z`). Paths are repository-relative.

- `references`, `candidates`, `baselines` entries: `path`, `sha256`, `locale`,
  `viewport` (`WIDTHxHEIGHT`), `scenario`. Candidates and baselines cover
  exactly the references' locale, viewport and scenario keys; each baseline
  matches its accepted candidate's digest.
- `comparison` (from `compared`): `path`, `sha256`.
- `deviations[]`: `description`, `approved` (boolean). Every deviation is
  `approved: true` by `member_accepted`.
- `preRequestReview` (optional from `compared`): `reviewer`, `reviewedAt`,
  `source`, `candidateSetSha256`, `findings` (count the reviewer returned),
  `open` (always `0`). It records the last
  [pre-request review](#pre-request-review) of the exact candidate set.
- `approvalRequest` (from `approval_requested`): `requestedAt`, `source`,
  `candidateSetSha256`, and `attempt` (1 for the first request of a surface,
  one higher after each rejection). `attempt` is optional unless the manifest
  policy below requires the review.
- `approval` (from `member_accepted`): `approvedBy`, `approvedAt`, `source`,
  `candidateSetSha256`.

A manifest may set the top-level `"policy": { "preRequestReview":
"required" }`. Every surface at `approval_requested` or later then needs a
`preRequestReview` and an `approvalRequest.attempt`, so a surface cannot skip
the review by moving to a later state. New manifests set it. An older
manifest adopts it with `"preRequestReviewFrom": "<UTC ISO timestamp>"` in
the same policy: surfaces whose `approvalRequest.requestedAt` is earlier
stay valid without the two records, and every later request needs them.

`candidateSetSha256` is the digest the validator's exported
`candidateSetSha256(candidates)` computes over the candidate entries. A
`member_accepted` row, with placeholders for every fact:

```json
{
  "id": "checkout-summary",
  "route": "/checkout",
  "selection": "Option B",
  "requiredRegions": ["order-summary"],
  "requiredInteractions": [],
  "state": "member_accepted",
  "references": [
    {
      "path": "docs/visual-acceptance/<initiative>/reference.png",
      "sha256": "sha256:<64 hex>",
      "locale": "en-US",
      "viewport": "1280x800",
      "scenario": "default"
    }
  ],
  "candidates": [
    {
      "path": "docs/visual-acceptance/<initiative>/candidate.png",
      "sha256": "sha256:<64 hex>",
      "locale": "en-US",
      "viewport": "1280x800",
      "scenario": "default"
    }
  ],
  "comparison": {
    "path": "docs/visual-acceptance/<initiative>/comparison.html",
    "sha256": "sha256:<64 hex>"
  },
  "deviations": [],
  "approvalRequest": {
    "requestedAt": "2026-01-02T03:04:05.000Z",
    "source": "<conversation or review reference>",
    "candidateSetSha256": "sha256:<64 hex>"
  },
  "approval": {
    "approvedBy": "<human approver>",
    "approvedAt": "2026-01-02T03:10:00.000Z",
    "source": "<conversation or review reference>",
    "candidateSetSha256": "sha256:<64 hex>"
  },
  "baselines": []
}
```

## Implementation loop

A surface is the unit of acceptance, and surfaces are independent. Work
several at once when each has its own branch and a
[capture lane](#capture-lanes) is free for it. One surface waits for another
only when it needs that surface's behavior, data or component: a technical
prerequisite the ticket names. Position in the manifest is not a
prerequisite. A project or human may still require one surface at a time;
record that as an explicit serial order.

A change to a component that another accepted or in-progress surface renders
is shared work. Land it as its own slice before the surfaces that need it,
then recapture every surface it moves.

Each surface runs a **draft loop**, which is cheap and repeats, and one
**proof run** per approval request.

1. Implement the surface in the real application. Inspect early rendered
   comparisons against the frozen reference during implementation, including
   relevant enabled controls and normal and enlarged text. Use the affected
   platform and supported diagnostic paths with their existing prerequisites;
   a mock does not prove native rendering.
2. Run its automated behavior, accessibility, localization, responsive, and
   lifecycle checks.
3. Batch feasible related shared fixes before final review and affected captures.
   Set the surface to `implemented`, commit it, and complete code review and
   accepted fixes before the proof run.
4. Draft loop: capture draft candidates through the proof run's capture path,
   using the same locale, viewport, scenario, and deterministic data as each
   reference. Drafts add no manifest state and replace no final coverage. Run
   the [pre-request review](#pre-request-review) on them, give every finding
   a disposition, and recapture the frames a repair can move. Commit each
   repair and pass the code review of that change before the proof run, so
   the proof run captures a committed, reviewed candidate. Repeat until the
   review returns no open finding. If the third review of a surface still
   returns one, stop: release the lane and report the open findings to the
   human as a blocker, with what each repair changed. The human chooses more
   repair, a recorded deviation or a changed scope.
5. Proof run: capture the full candidate set from the committed candidate.
   Record candidate hashes and a side-by-side comparison artifact following
   [Comparison presentation](#comparison-presentation). The reviewer inspects
   every frame whose bytes differ from the last reviewed draft; record the
   result as `preRequestReview`, set the surface to `compared` and validate
   the manifest.
6. Record an approval request bound to that candidate-set hash, set
   `approval_requested`, validate again, release the capture lane, and end the
   turn with the mandatory request printed by the validator below.
7. On rejection or any candidate-changing edit, clear `approvalRequest`,
   `preRequestReview`, `approval` and `baselines`, and return to `compared`.
   Repair every finding in the rejection, rerun the draft loop for the frames
   those repairs move, then make one proof run and request approval again
   with `attempt` one higher. Preserve existing baseline files until new
   approval.
8. On explicit approval, bind the approval to the requested surface and
   candidate-set hash; set `member_accepted`.
9. Copy the accepted candidate bytes to regression baselines, record their
   hashes, rerun the visual tests, and set `baseline_promoted`.
10. Only then resolve the surface, merge it, and unlock work blocked by it.

## Capture lanes

A capture lane is one isolated capture environment: a device, emulator or
browser with the services and data it needs. The number of lanes the project
can run at once limits concurrent capture. Implementation, desktop checks
and code review need no lane.

- Hold a lane only while capturing or proving. A recorded approval request is
  bound to candidate hashes, so the lane is free while the human decides.
- Pass the project's lane preflight before taking a lane: an off-lane check
  that every registration a new capture case needs is present (case lists,
  fixtures, fonts, observers, recipes). A registration found missing on the
  lane is a preflight gap; add it to the preflight in the same change.
- Keep captures byte-stable: freeze system chrome (clock, battery, network
  indicators), animations and data. Prove it once per capture path by
  capturing an unchanged surface twice and comparing hashes. Where a platform
  cannot give stable bytes, the project's comparison tool defines an
  unchanged frame, such as zero differing pixels outside a declared mask, and
  every changed-frame rule in this protocol uses that definition.
- Bind each proof to the inputs the surface runs. A proof bound to the whole
  tree goes stale on every unrelated merge. While a project binds that
  widely, integrate the target branch first and prove once at the end.
- Merge a surface when it is promoted. A finished branch held back to keep
  another surface's proof valid is a binding defect; report it.
- Batch the gates only a human can pass (approval, manual accessibility or
  device passes) into one sitting per group of ready surfaces.

## Pre-request review

A rejected approval request costs a proof run and the human's attention.
Request approval only for a candidate an independent reviewer could not
fault.

- The reviewer is not the surface's author and starts from a fresh context
  window: a subagent, another model or a person. Give it the references, the
  candidates, the row's required regions and interactions, and the recorded
  deviations. It returns findings, not images.
- It inspects every reference and candidate pair at each required locale,
  viewport and scenario, element by element: maps, forms, buttons,
  typography, icons, spacing and shared navigation. Pairs whose reference
  bytes and candidate bytes both repeat an inspected pair are inspected once.
- It returns one complete list: every difference in every pair, naming the
  pair, the element and what differs. A review limited to earlier findings
  misses differences nobody has named yet.
- The author gives each finding one disposition: repaired, recorded as a
  deliberate adaptation for the human to assess, or no difference with the
  reason. Keep repairs scoped to the finding; fixing an arrow's alignment
  preserves the surrounding link unless a broader change is requested.
- After a repair, the reviewer inspects the frames that changed and confirms
  the rest as unchanged. Hashes confirm that only where the capture path is
  proven byte-stable; elsewhere use the project's unchanged-frame test from
  [capture lanes](#capture-lanes), and until the project has either, inspect
  every frame again. Between drafts, compare the two draft sets; drafts are
  not in the manifest. Between approval requests, the validator's
  `--changed-since` lists the frames whose recorded digest differs from two
  copies of the manifest.
- A surface with more frames than one reviewer can inspect with care is
  split by scenario group across several reviewers. Each returns a complete
  list for its group; the record's `findings` is their sum.
- The review is done when the reviewer returns no open finding for the exact
  candidate set. Record it as `preRequestReview`.

The validator checks the record's shape and hash; it cannot prove the
reviewer was independent. Passing behavioral checks or this review does not
establish human acceptance.

## Comparison presentation

Use the project's existing comparison-build entry and reviewed-pair selector.
For each inspected difference, add numbered arrows anchored to image coordinates
and matching explanations beside the pair. Name the affected reference or
candidate image; use the same number for corresponding locations across both
images when applicable. Keep numbers readable with high contrast, arrows off
the inspected detail, accessible text, and an unobstructed original view.
Label deliberate adaptations without implying approval. For an inspected pair
with no identified differences, state "No differences identified" and add no marker.

Use HTML or SVG overlays and preserve original image bytes and hashes, all
required pairs, their order and pair identities. Bind inspections to the exact
pair; reject stale annotations and regenerate them after a pair changes.
Keep the HTML self-contained and open it directly from disk without a server
or adjacent-data fetch. Check ordinary and narrow layouts, image zoom, pointer
alignment, navigation and accessible explanations through the actual producer
and consumer. Follow existing comparison-file hash and approval rules.
Presentation checks grant no product or native approval; retain the existing
owners of capture identity and proof applicability.

## Approval boundary

An approval request records its ISO timestamp, durable conversation or review
source, and candidate-set SHA-256. The same turn must end with this block and
no text after it:

```text
Approval required: <surface id>: <selected option>
Comparison: <clickable comparison path or URL>
Candidate set: <sha256 digest>
Deviations: <None or concise list>

Do you approve this exact production candidate?
Reply "Approve" or "Reject".
```

Generate that block after validation and copy its stdout verbatim:

```bash
node scripts/validate-visual-acceptance.mjs \
  docs/visual-acceptance/<initiative>/manifest.json \
  --print-request=<surface-id>
```

Several surfaces at `approval_requested` share one request: pass their ids
comma-separated (`--print-request=<id>,<id>`). The human answers
`Approve all`, or names each surface. Each approval is still recorded on its
own surface, bound to its own candidate-set hash.

A rejection is complete. It lists every finding for the surface in one pass,
copies every reviewer finding including those judged minor, and states for
each whether it needs a repair, a recorded deviation or nothing. A later
rejection of the same surface raises only frames that changed, regressions,
and findings it marks as missed earlier.

An immediate explicit `Approve` response is bound to the surface and hash
shown in that request; the human does not need to repeat the digest. Generic
messages such as "continue", "looks good", or an earlier prototype selection
do not approve production. On a later invocation, handle a bound human response
before redisplaying a pending request. Verify the exact files and hashes before
recording approval. If `approval_requested` remains unresolved, show the request
again before doing other work.

Record:

- human approver
- ISO timestamp
- durable review source (for example a protected PR review URL or recorded
  conversation reference)
- candidate-set SHA-256 printed by the validator
- every accepted deviation from the reference

The validator checks structure and hashes; it cannot authenticate a human.
Treat approval as a human-owned process boundary. The implementation agent may
present the request and record an explicit response, but it must never invent,
infer, or self-author approval. Repository hosting controls are optional and
sit outside this protocol.

## Reporting

Always report these counters separately:

```text
Implemented: <n>/<total>
Compared: <n>/<total>
Approval requested: <n>/<total>
Member accepted: <n>/<total>
Baseline promoted: <n>/<total>
```

Report these measurements for each surface when it closes, in the ticket's
closing record:

- approval cycles: its highest `attempt`. Name any surface above two;
  repeated rejection means the pre-request review missed findings.
- draft-loop reviews: how many pre-request reviews ran before the proof run.
- lane holds: the UTC time each capture lane was taken and released.
- proof runs: how many times the bound proof ran.
- elapsed time from `implemented` to `baseline_promoted`.

Use one table row per lane hold so a project can total them:

```markdown
| Surface | Attempts | Draft-loop reviews | Lane | Taken (UTC) | Released (UTC) | Proof runs | Implemented (UTC) | Promoted (UTC) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```

A project compares the rows across surfaces to find its slowest step.

Use `implementation candidate` while any applicable surface is below
`member_accepted`. Use `complete` only when every applicable surface is
`baseline_promoted` and all non-visual acceptance gates also pass.

## Validation

Run the bundled dependency-free validator from the target repository root:

```bash
node scripts/validate-visual-acceptance.mjs \
  docs/visual-acceptance/<initiative>/manifest.json
```

`--print-request=<surface-id>[,<surface-id>...]` fails unless the manifest is
valid and every named surface is exactly `approval_requested`.

`--changed-since=<previous-manifest.json>` lists, per surface, the candidate
frames whose recorded digest differs from that earlier copy of the manifest
(for example `git show <rev>:<manifest path>` saved to a temporary file). It
compares the two manifests' records and reads no evidence file, so it also
runs where the evidence is absent. Use it to scope the re-review after a
rejection. It cannot see drafts, which add no manifest state.

Use `--require-complete` only at the final completion gate. Setup installs the
validator in the repository. Run it locally before each state change and
before claiming completion.

## Workflow ownership

- **Wayfinder** freezes selected references and creates the manifest.
- **to-spec** creates or repairs a missing planning manifest, then carries its
  path and acceptance boundary into the spec.
- **to-tickets** repeats that preflight before drafting, then creates one gated
  surface slice per manifest row with its technical blocking edges, with
  local-validator setup first when needed.
- **implement** performs the last creation preflight before editing code,
  requires `design_selected`, produces candidates, and pauses at the human
  boundary. It never self-approves or promotes an unaccepted baseline.
- **code-review** reports Standards and Spec independently, then reports visual
  acceptance status without converting a clean code review into human
  acceptance.

## Terminal conditions

A ticket or initiative with a visual parity action remains open when any
applicable row is below its required state. Review loops, green tests, snapshot
updates, and commits cannot substitute for the missing state transition.
