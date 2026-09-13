# Matt Pocock fork for Codex

This is the `DenislavVelichkov/skills` fork. Maintain the Codex adaptation on `dv8/main`; check the branch and existing changes before editing. `AGENTS.md` owns Codex repository instructions. `CLAUDE.md` remains the separate Claude instruction file.

## Skill organization

- Skills live under `skills/engineering/`, `skills/productivity/`, `skills/misc/`, `skills/in-progress/`, and `skills/deprecated/`.
- Engineering and productivity are the promoted buckets. Their skills need entries in the top-level README and the Claude plugin's skill list. Miscellaneous, in-progress, and deprecated skills stay outside that promoted set.
- The root `.codex-plugin/plugin.json` explicitly selects the Codex skills. Treat it as the authority for Codex exposure; preserve its selection unless the task requests a change. Claude metadata does not determine Codex installation.
- For a skill's Codex invocation policy, read its `agents/openai.yaml`. Preserve explicit versus implicit invocation when editing. See [.agents/invocation.md](.agents/invocation.md) for the two-platform contract.

## Documentation

- README skill names link to their `SKILL.md`. Bucket READMEs list each skill with a one-line description; promoted lists separate user-invoked and model-invoked skills, while other buckets use flat lists.
- Adding, renaming, or changing a promoted skill also updates its page under `docs/<bucket>/`. Follow [.agents/writing-docs.md](.agents/writing-docs.md), including the required four sections. Public pages use `https://aihero.dev/skills-<skill-name>` regardless of bucket. Non-promoted skills have no public docs page.
- When a change affects how a user-reachable skill fits the workflows, read and update [ask-matt](skills/engineering/ask-matt/SKILL.md) so its routing matches the available skills.
- For upstream Claude installation documentation, use [.agents/install-block.md](.agents/install-block.md). Historical ADRs describe earlier decisions, not the current Codex manifest.
- Avoid em dashes in repository prose and comments. Rewrite the sentence rather than mechanically replacing punctuation.

## Installation and verification

- Codex installs this root plugin through `dv8-marketplace`, maintained in `DenislavVelichkov/dv8-codex`, with the fork ref `dv8/main`. Keep changes in the source checkout rather than installed caches.
- `scripts/link-skills.sh` is an upstream development helper that writes to global skill directories. Run it only when the user specifically requests that installation method; marketplace installation does not need those symlinks.
- Validate changed JSON with `jq` and check that selected Codex skill directories contain `SKILL.md`. For skill changes, run the smallest relevant repository check and verify documentation and invocation metadata remain consistent.
- Run `claude plugin validate . --strict` when changing a Claude plugin or marketplace manifest. That check is not required for a Codex-only guidance edit.
