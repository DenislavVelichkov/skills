# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI.

## Repository and capabilities

Use the configured repository `OWNER/REPO`. Setup replaces this placeholder with
its verified destination. Resolve it from project tracker policy and actual
remotes; in a fork, do not assume the upstream or `gh` default is correct.
Check `gh repo view OWNER/REPO --json nameWithOwner` before the first write.
Pass `--repo OWNER/REPO` to issue and PR commands and use that repository in API
paths. Preserve configured category/state role mappings and PR policy.

Check `gh --version`, `gh issue create --help` and `gh issue edit --help` before
using relationship flags. Use supported CLI operations or the documented REST
API below. An authentication, permission or partial-response error does not prove
that native relationships are unavailable. Use textual fallback only when native
support is unavailable and project policy permits it; report the limitation.

## Conventions

- Create with `gh issue create --title "..." --body-file <path>`. Save the exact body first.
- Read the full issue with `gh issue view <number> --json number,title,body,comments,labels,author,createdAt,updatedAt,url`; use `jq` to inspect it.
- List the requested scope with `gh issue list --state open --json number,title,body,labels`. A bounded listing is discovery, not a complete hierarchy or discussion. Read comments for each selected item.
- Comment with `gh issue comment <number> --body-file <path>`.
- Apply or remove mapped labels with `gh issue edit <number> --add-label "..."` or `--remove-label "..."`; preserve unrelated labels.
- Close with `gh issue close <number>` only after the completion gates below.

## Native ownership and blockers

For a known specification, each implementation ticket has its approved native
parent, directly or through an organizational group. Native ownership and
blocking are separate relationships. A textual parent link, label or checklist
alone proves neither. Retain every approved technical, external and serial
blocker; belonging to a spec does not itself make that spec a blocker.

When installed help supports them, use `gh issue create --parent <parent>` or
`gh issue edit <parent> --add-sub-issue <child>` for ownership, and
`gh issue create --blocked-by <n>,<n>` or
`gh issue edit <child> --add-blocked-by <blocker>` for dependencies.
The REST alternatives use numeric database IDs, not issue numbers or node IDs:

```sh
# Read .id for each child or blocker before writing its relationship.
gh api repos/OWNER/REPO/issues/CHILD --jq .id
gh api --method POST repos/OWNER/REPO/issues/PARENT/sub_issues -F sub_issue_id=CHILD_DB_ID
gh api --method POST repos/OWNER/REPO/issues/CHILD/dependencies/blocked_by -F issue_id=BLOCKER_DB_ID
```

After publication or repair, read each child's native parent and the complete
paginated child list at every parent, including closed children and grouped
descendants. Read each child's complete paginated blocker list, body and labels:

```sh
gh api --method GET repos/OWNER/REPO/issues/CHILD/parent
gh api --method GET --paginate --slurp 'repos/OWNER/REPO/issues/PARENT/sub_issues?per_page=100'
gh api --method GET --paginate --slurp 'repos/OWNER/REPO/issues/CHILD/dependencies/blocked_by?per_page=100'
```

Follow every next page or GraphQL cursor, including searches. Match saved issue
identities against approved parents, leaves, role labels and blockers. Summary
counts or a successful write do not establish complete membership. Closed
blockers remain edges; only open blockers prevent execution. Missing or extra
edges require reconciliation with the approved graph.

For a missing or wrong parent, first verify the child's identity and authority
to change ownership. The add-child API's `replace_parent: true` replaces a wrong
parent; use it only for that approved repair and read back both old and intended
parents. An inaccessible parent is uncertain, not a confirmed missing parent.

Before retrying an uncertain create, inspect the saved result and search every
relevant page for the approved ticket's identifiers and exact content, including
unlinked issues. Reuse an existing match and complete only missing operations
for body, parent, blockers or labels. Never repeat a successful create to repair
a failed link. Multiple plausible matches or inaccessible results stop dependent
writes until identity or access is resolved. Record partial writes, failures,
repairs and read-back in the existing progress record.

If native ownership is unavailable under an allowed fallback, add the child to
a task list in the parent and put `Part of #<parent>` in the child's body. For
unavailable dependencies, use `Blocked by: #<n>, #<n>`. Report these as textual
fallbacks, never as verified native relationships. Ticket publishing follows
the available `to-tickets` skill's `PUBLICATION.md` reference for the detailed
publication sequence; reading that reference does not invoke the skill.

## Capacity and navigation

GitHub permits 100 direct children per parent and eight levels of nesting.
Count all existing children, including closed history, plus missing planned
children before adding them. Reuse approved organizational groups; nest further
only within the depth limit. Resolve an absent grouping convention before
changing ownership. Reparent existing leaves instead of splitting, renumbering,
reopening or replacing them. Preserve scope, states, acceptance criteria,
blockers and serial order. Verify the approved leaf total across all groups;
organizational groups and separate follow-ups do not increase that denominator.

The flat Issues list still shows child rows. Navigate from the specification's
expandable sub-issue tree and group links. Preserve project-approved pinning and
filters; setup does not change GitHub's default list or those choices.

## Triage eligibility

Apply this distinction before discovery counts and specific-item evaluation:

| Item                                                                                    | Execution triage                                                                                   |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Pure specification containers or organizational groups that only organize approved work | Exclude even when unlabeled; report their planning role without changing labels or state.          |
| Actionable parents with their own requested behavior and acceptance work                | Eligible like standalone requests; having children alone does not exclude them.                    |
| Ordinary standalone requests                                                            | Use normal triage and configured category/state roles.                                             |
| `to-tickets` work already agent-ready                                                   | Do not retriage, even while blocked; check blockers when choosing execution work.                  |
| Role or purpose is uncertain                                                            | Read the body, discussion and ownership; ask the maintainer if still uncertain before changing it. |

Container status comes from the issue's purpose and approved plan, not its
label count, title or number of children. Preserve generated agent-ready work
and unrelated labels. This policy grants no new triage invocation, verification
or mutation permission and changes none of its mandatory notices.

## Implementation progress

When completing or pausing an issue, comment with the commit or PR, checks and
results, acceptance criteria met, and remaining work or blockers. Update its
checklist or labels where project policy requires it. Close only after required
gates pass on the intended integration branch; otherwise leave it open. A
`#<number>` commit reference alone does not record progress.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When enabled, use `gh pr view <number>`, `gh pr view <number> --comments`,
`gh pr diff <number>`, and the `gh pr` comment/edit/close equivalents. Preserve
project authorization for running contributor code and applying outcomes.
List external PRs through the [pull-request REST endpoint](https://docs.github.com/en/rest/pulls/pulls#list-pull-requests),
not an unsupported `gh pr list --json authorAssociation` field:

```sh
gh api --method GET --paginate 'repos/OWNER/REPO/pulls?state=open&per_page=100' --jq '.[] | select(.author_association == "CONTRIBUTOR" or .author_association == "FIRST_TIME_CONTRIBUTOR" or .author_association == "NONE")'
```

Fetch each selected PR's full discussion separately, including inline review
comments with `gh api --method GET --paginate
'repos/OWNER/REPO/pulls/NUMBER/comments?per_page=100'`. Use
`gh pr view <number> --json number,title,body,author,state,labels,comments,reviews`
for its structured context. GitHub shares one number
space across issues and PRs; resolve a bare number with `gh pr view` and fall
back to `gh issue view`.

## Publishing and fetching

"Publish to the issue tracker" means create a GitHub issue. "Fetch the relevant
ticket" means read its full body, comments and configured roles as above.

## Wayfinding operations

The map is one issue labelled `wayfinder:map`, holding the
Notes / Decisions-so-far / Fog body. Create it with
`gh issue create --label wayfinder:map`. Its child tickets follow the native
ownership and separate blocker rules above. Use `wayfinder:<type>` for
`research`, `prototype`, `grilling` or `task` and preserve configured triage roles.
The frontier is its open, unassigned children without open blockers, in map order.
Claim with `gh issue edit <n> --add-assignee @me`, the session's first write.
Resolve with `gh issue comment <n> --body-file <answer-path>`, close the child,
then append a linked context pointer to Decisions-so-far.

## Official operations

Check current [sub-issue limits](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues),
[sub-issue API](https://docs.github.com/en/rest/issues/sub-issues),
[dependencies](https://docs.github.com/en/rest/issues/issue-dependencies) and
[pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
when an installed capability differs. CLI failure alone does not authorize a fallback.
