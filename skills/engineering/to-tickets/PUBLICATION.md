# GitHub publication and recovery

Read this before GitHub writes in step 5. The approved breakdown and configured
tracker and label guidance control publication. This reference grants no new
publication, implementation, delegation or model authority.

## Prepare ownership and roles

Confirm the repository from its configured tracker and actual remotes. Inspect
`gh --version`, `gh issue create --help` and `gh issue edit --help`; use only
supported flags. Prefer the configured operation, or the documented REST API
when a CLI flag is absent. A CLI error, permission failure or partial response
does not establish that GitHub lacks native relationships. Use textual fallback
only when the tracker policy permits it and native support is unavailable.

Resolve configured category and state roles before writing. Apply the configured
category to each approved implementation ticket and its `ready-for-agent` state
role. A fully specified blocked child stays agent-ready. An unresolved human
design choice uses the configured `ready-for-human` role. Keep specification and
group containers distinct from executable tickets; do not label them agent-ready
just because they own children. Preserve custom role names and unrelated labels.
If a required mapping is missing, report it and tell the user to run setup;
do not invent labels or change setup templates here.

For a known spec, record the approved parent for every leaf, directly or through
its configured group. Native ownership and native blockers are separate facts.
A parent link, label, checklist or body link does not prove either blocking or
verified ownership. Preserve each leaf's requirements and explicit serial edges.

## Capacity and grouping

GitHub allows 100 direct children per parent and eight levels of nesting.
Before adding children, read the complete paginated child list, including
closed issues and unrelated existing children. Count existing children plus
missing planned children at each parent. Follow the configured grouping convention
before exceeding capacity, and check the nesting depth of any new group.
Reparent existing issues where the approved convention requires it; preserve
existing issue states and serial order. Verify the approved leaf-ticket total
across every group, without counting containers as implementation tickets.

Reuse existing approved groups and closed history. Do not split, renumber,
reopen, close or replace leaves to fit the limit. Grouping changes ownership,
not dependencies or scope. If the convention is absent or cannot fit, resolve
that decision before dependent publication; keep independent authorized work.

## Write and read back

Save each approved ticket's exact body before creating it. Publish blockers
first and reuse the saved issue identity when it exists. Where installed help
supports them, `gh issue create --parent <n> --blocked-by <n>,<n> --body-file <path>`
can create the issue and request relationships. A successful command is not
verification of all requested effects.

Read each child's native parent, its body and labels, and its complete paginated
blocker list. Also read every intended parent's complete paginated child list.
For example, the documented read endpoints are:

```sh
gh api --method GET repos/OWNER/REPO/issues/CHILD/parent
gh api --method GET repos/OWNER/REPO/issues/CHILD
gh api --method GET --paginate --slurp 'repos/OWNER/REPO/issues/PARENT/sub_issues?per_page=100'
gh api --method GET --paginate --slurp 'repos/OWNER/REPO/issues/CHILD/dependencies/blocked_by?per_page=100'
```

Use `jq` to inspect all returned pages. Follow every next page or GraphQL cursor
until exhausted, including for searches and grouped descendants. Summary counts
and the first page cannot prove complete membership. Match each approved ticket
to its saved identity, read back its labels against configured roles, and compare
its blockers with the approved edges. Closed blockers remain recorded edges;
only open blockers prevent execution. Reconcile missing or extra blockers against
all approved technical, external and serial prerequisites. Correct wrong role
labels without removing unrelated labels. Remove an edge only when the approved
graph authorizes that change, then repeat complete read-back. Preserve unrelated
children and labels.

Repair a missing or wrong parent only after confirming the issue is the approved
ticket and the intended ownership change is authorized. For the REST add-child
operation, `sub_issue_id` is the child's numeric database ID, not its issue
number or node ID; `replace_parent: true` explicitly replaces a wrong parent.
The dependency operation separately uses `issue_id` for the blocker's database
ID. Verify current documentation and read back both directions after repair.
Never treat an authentication or access error as proof that a parent is absent.

## Reconcile before retrying

For an uncertain create, inspect the saved result and search the approved ticket's
identifiers and exact content, including issues not yet linked to the parent.
Read all relevant pages and confirm whether it exists. Do not create a duplicate.
For partial writes, reuse the existing issue and complete only missing operations
for body, parent, blockers or labels; read back each repair. Never replay a
successful create to fix a failed link. If multiple matches or inaccessible
results leave identity uncertain, stop dependent publication and report the
unresolved operation instead of guessing.

Record exact issue identities, intended and observed links, edits, failures and
reconciliation outcomes in the existing progress record. Before reporting the
set published, verify every approved leaf, parent, blocker and configured role,
the leaf totals and preserved states/order. Report any incomplete operation.
Stop before implementation; the approved ticket set grants no execution authority.

## Bounded inspection cases

These are API-shaped decision examples for instruction checks, not generated
issues, a publisher implementation or observed runtime execution. No live issue
set is needed. Inspect them separately in each host's authorized consumer.

| Observed input                                                                                | Required decision                                                                                                        |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Child `12` exists; parent GET is a confirmed missing relationship                             | Attach existing `12` to its approved parent; read back parent and membership.                                            |
| Child `12` has parent `7`; approved parent is `9`                                             | Verify identity and reparent authorization, repair ownership, then verify both parents; preserve blockers.               |
| Child pages `[[12], [13]]`; approved leaves are `12,13`                                       | Read both pages; `13` is present and must not be recreated.                                                              |
| Blocker pages `[[{number:10,state:closed}], [{number:11,state:open}]]`                        | Retain both native edges; `11` still blocks execution.                                                                   |
| Roles map feature to `change`, agent-ready to `agent-ok`; `12` is fully specified but blocked | Read back `change` and `agent-ok`; do not move it to a waiting state or label its spec as executable.                    |
| Parent has 100 children; one approved leaf is still missing                                   | Apply configured grouping, count existing closed children, preserve leaf identities and states, verify depth and totals. |
| Create times out; search finds saved-content issue `12` without a parent                      | Reuse `12`, attach it and verify; do not create another issue.                                                           |
| Issue `12` and its parent exist; blocker write failed; category label is absent               | Repair only the missing blocker and label, then read back all facts.                                                     |
| Search returns two plausible matches, or parent GET is inaccessible                           | Preserve the results and stop dependent writes until identity or access is resolved.                                     |

A read-back with blockers `10,9` when the approved prerequisites contain only
`10` requires reconciling the extra edge to `9`. Being the spec's child does not
make the spec a blocker. Preserve an external admission prerequisite when it is
part of the approved graph.

## Official basis

Checked 2026-11-07 against GitHub's [sub-issue limits](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues),
[sub-issue API](https://docs.github.com/en/rest/issues/sub-issues),
[dependency API](https://docs.github.com/en/rest/issues/issue-dependencies),
[pagination guidance](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
and [CLI create manual](https://cli.github.com/manual/gh_issue_create).
Installed capabilities still need the help checks above. Setup owns tracker
configuration; this reference consumes it without changing defaults.
