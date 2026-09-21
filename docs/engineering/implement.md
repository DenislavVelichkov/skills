## What it does

`implement` builds work that has already been decided. You point it at one [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), or at a small plan still present in the current conversation, and it writes the code, drives [tdd](https://aihero.dev/skills-tdd) at the seams, typechecks as it goes, commits the integrated candidate to the current branch, and runs [code-review](https://aihero.dev/skills-code-review) against it.

It carries settled scope, decisions and test boundaries forward. Only consequential unresolved decisions need a new question; independent authorized work continues while those answers are pending. Planning still requires a separate implementation request.

Validation follows the behavior being changed. Existing desktop tests provide
feedback during editing; platform-owned behavior needs focused native checks.
Required final proof still runs on the stable candidate.

Audits and reviews inspect retained evidence without starting live scenarios.
Explicit validation shares verified assessments within the project's supported
operation, expires them after relevant changes, and records failed work as well
as successful reuse. Existing native and human acceptance gates still apply.

## When to reach for it

Verification follows the change: focused checks during implementation, required
final checks on the stable candidate, and expensive evidence capture only for
missing or affected claims. Reuse depends on the project's verifier proving
that the relevant inputs still match. Existing acceptance and approval gates
continue to apply.

You invoke this by typing `/implement` yourself: the agent won't reach for it on its own. It ships with `disable-model-invocation: true`, so no other skill can call it either. Wherever [ask-matt](https://aihero.dev/skills-ask-matt) or [to-tickets](https://aihero.dev/skills-to-tickets) says "then `/implement` per ticket", that is an instruction to you, not something the agent will do unprompted.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| A ticket on the tracker | `/implement #42`, one ticket per [session](https://www.aihero.dev/ai-coding-dictionary/session), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) context between tickets |
| A published spec, whether large or small | [to-tickets](https://aihero.dev/skills-to-tickets) first, then `/implement` per ticket |
| Only in the conversation you just had, and it's still small | `/implement` right there, in the same window |
| Not written down anywhere yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), or [grill-me](https://aihero.dev/skills-grill-me) if there's no codebase |
| One concrete behaviour you want test-first, with no spec | [tdd](https://aihero.dev/skills-tdd) directly |
| Already built, and you want it checked | [code-review](https://aihero.dev/skills-code-review) directly |

The same-session case is worth naming because no tracker artifact exists. If the small plan lives only in the thread, say so when you invoke it. Once a spec has been published, it must pass through `to-tickets` before code changes begin.

## Prerequisites

`implement` commits to the branch you are on. It does not create one, and it does not ask. Check you are on the branch you want the work on before you start.

If the tickets came from [to-tickets](https://aihero.dev/skills-to-tickets), the tracker they live on was configured by [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). `code-review` reads the same configuration to find the originating spec at close-out.

## What one run does

A run traces the ordinary entry and dependencies, connects the real path, completes required behavior, validates a stable candidate, and reviews its committed diff.

Each batch names an ordinary entry, demonstrable behavior and an existing check
that can expose a broken path. Real authorization, validated contracts,
persistence and essential accessibility belong in the first connected path.
Small red-green cycles stay inside that batch. Required secondary states and
acceptance gates remain assigned until complete.

One invocation covers one ticket. There is no timer or context-window cutoff
for its authorized objective. Preserve decisions and the next action across
compaction. Commit the integrated candidate before review; group accepted
fixes and review their delta plus affected callers. A bookkeeping edit does
not require another full review or a separate review-documentation commit.

A ticket has a visual parity action only when it requires a production surface
to be compared against a visual reference, requires selecting the reference for
that comparison, or links an existing manifest that records either obligation.
UI work without that obligation uses the normal implementation path.

Before implementing a visual parity action, `implement` validates the manifest
and the ticket's comparison row. If either is missing, it creates or repairs the
`planned` artifact from the ticket and parent spec. The comparison surface must
have durable, hashed references and be at least `design_selected` before code
changes begin.

Once the target surface is `design_selected`, visual tickets have a deliberate
human boundary inside the run. The first implementation invocation builds the
real surface, captures every manifest candidate, and stops after producing the
side-by-side comparison and candidate-set hash. No snapshot baseline moves. A
later invocation may promote those exact bytes only when your approval names
both the surface and hash.

That pause is not unfinished automation; it is the point at which automation
has reached the decision it cannot make. Code review can establish that the
candidate is built correctly and follows the spec, but it cannot decide that
the rendered result is the design you accept.

## Pre-agreed seams

The idea the skill runs on is the **seam**: the public boundary you observe behaviour at, without reaching inside. Tests live at seams. Working at a seam agreed before any code is written is what keeps the tests durable, because the implementation underneath can be rewritten without the tests moving.

Reuse test boundaries confirmed in the ticket, spec or conversation. If none is established, recommend a public boundary and explain what it catches before asking the user to choose. Existing agreement does not need another approval.

## Common questions

**Does each ticket need new verification tooling?**

A ticket adds its own fixtures, assertions and registration to the existing
runner. Shared-tooling repairs must name the blocked check and stop when that
check works. General infrastructure improvements stay separate from feature
delivery unless requested. Required acceptance checks still apply.


**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

Record completion evidence and remaining requirements in the existing ticket. A commit or clean review does not close unmet acceptance gates. Accepted review findings are fixed in related batches, checked, committed and reviewed as a delta.

**Can I point it at all my tickets at once, or run several in parallel?**

No. One invocation, one ticket. Batch dispatch across a ticket queue and [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) fan-out are both requested repeatedly, and neither exists. Running several `/implement` sessions side by side in one checkout is worse than unsupported: one field report describes a `git commit --amend` in one session landing on another session's commit, a stash vanishing from `refs/stash`, and commits landing on the wrong branch, all in a single afternoon across three issues. The sessions share one working directory, one index, and one HEAD. Git worktrees are the community workaround, and note that `refs/stash` is shared across worktrees too, so worktrees alone do not fix the stash case. If you want parallelism today, you are assembling it yourself.

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch, which several people find too eager: the code lands before they have had a chance to verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill.

**`code-review` says it cannot see my changes.**

`code-review` excludes uncommitted changes. `implement` commits the integrated candidate first and supplies the recorded task-start commit, so the review sees the complete change.

An independently authorized reviewer can reduce author bias. Review runs locally by default; parallel review requires explicit authorization.

**What happens if a visual parity ticket points at no manifest?**

The skill creates the missing planning artifact before it edits code. It does
not treat that creation as design approval. If the ticket and parent spec do
not provide frozen references, the new surface remains `planned` and the run
stops with the missing evidence named explicitly. A UI ticket without a
production-to-reference comparison needs no manifest.

**One ticket burned 150k tokens. Am I using it wrong?**

Retain a concise current-state handoff and continue the authorized objective. Split work only along coherent behavior and dependency boundaries, preserving every requirement and its owner. Context size is not a completion criterion.

**`/implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by reading the exact ticket or retained same-session plan and restating what it will build, rather than asking you what to build.
- You can see an actual `/tdd` invocation in the trace, not just tests appearing in the diff.
- Typechecks and single test files run repeatedly during the run, and the full suite runs once near the end.
- The run reaches a commit on your current branch without you prompting it to carry on.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.
- A manifest is created only for a visual parity action, and a `planned`
  comparison surface still blocks implementation.
- A visual parity run reports Implemented, Compared, Approval requested, Member
  accepted, and Baseline promoted separately.
- Once comparison evidence is ready, the validator prints the exact approval
  question and the implementation turn ends with it. Work cannot continue
  until the human explicitly approves or rejects that candidate hash.

## Where it fits

`implement` is the build step of the main chain, second from the end:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which produces the tickets it consumes and declares the blocking edges that decide their order; [tdd](https://aihero.dev/skills-tdd), which it drives internally at each seam; and [code-review](https://aihero.dev/skills-code-review), which reviews its committed integrated candidate. It sits downstream of the planning skills and trusts their implementation decisions. Missing dependencies and unresolved decisions are recorded against their existing owners; they never silently expand the ticket.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. `implement` must not build from a map or parent spec.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
