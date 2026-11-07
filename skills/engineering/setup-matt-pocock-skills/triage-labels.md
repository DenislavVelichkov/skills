# Triage Labels

The skills use two category roles and five state roles. Every triaged item needs one role from each group. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `bug`                      | `bug`                | Something is broken                      |
| `enhancement`              | `enhancement`        | New feature or improvement               |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the "Label in our tracker" column to match whatever vocabulary you actually use.

Apply these roles only to eligible work under the GitHub tracker's
[Triage eligibility](issue-tracker-github.md#triage-eligibility) rules. Setup
writes this link as `issue-tracker.md#triage-eligibility` in the repository copy
(or uses its configured tracker path). Containers need no execution-state role.
A fully specified generated child keeps its mapped `ready-for-agent` label while
blocked; blocking is a separate dependency, not a new triage state.
