# Global Codex config investigation

Investigated 2026-10-21. All times below are Europe/Sofia, UTC+03:00.

## Exact baseline

The pre-refresh check saved a SHA-256 checksum at 11:40:05.398, but no full
config copy. Reversing the plugin-table move and four hook enablement changes
in memory reproduces that checksum exactly:

`019803ab007c484ed822abfb28fc150712e738a25a1bb4b9d7adc9273812fe17`

The current config checksum is:

`c2e85295b454e4a59ec63442391f43eed51fac0230f2431c0df0f198ad1b1786`

The complete difference is saved in `config-refresh-diff.txt`. No other bytes
changed between the reconstructed snapshot and the inspected current file.

## Changes

- The `mattpocock-codex@dv8-marketplace` plugin table moved after `dv8-codex`.
  Both plugins remain enabled. This changes ordering without changing values.
- Four `dv8-codex` hook entries changed from `enabled = false` to `true`:
  `pre_tool_use:0:0`, `session_start:0:0`, `pre_tool_use:1:0` and
  `post_tool_use:0:0`. These correspond to the Bash command guard, advisor
  session initialization, and advisor records before and after tool calls.
- Model `gpt-6-astra`, effort `xhigh`, desktop mode `STEPS_COMMANDS`, hook trust
  hashes, permissions, skill preferences and all remaining configuration were
  already identical at the pre-refresh snapshot.

## Timeline and attribution

The desktop log is
`/home/dv8/.local/state/codex/logs/2026/10/21/codex-desktop-dd175557-3264-40ca-a121-76d0ba3d2edd-31309-t0-i1-000001-0.log`.

- 11:40:00.900: the desktop displays the `dv8-codex` hooks settings page,
  log line 12859.
- 11:40:03.488 through 11:40:05.039: four `config/batchWrite` completions.
  The saved checksum immediately afterward has all four hooks disabled.
- 11:40:05.721 through 11:40:08.183: four more desktop `config/batchWrite`
  completions, log lines 13583, 13741, 13886 and 14031. Each is followed by
  a hooks-list refresh. This supports re-enablement through the settings page.
- 11:40:29.125: this chat calls `codex plugin add mattpocock-codex@dv8-marketplace`.
  The call time is recorded in the chat rollout.
- 11:44:54.080: the desktop records successful uninstallation of
  `mattpocock-codex@dv8-marketplace`, log line 14784.
- 11:44:59.332: the desktop records successful installation of the same
  plugin, log line 15258. Removing and recreating its table explains its new
  position after `dv8-codex`.
- 11:45:03.436 and 11:45:05.065: the desktop records two config writes while
  displaying the mattpocock hooks settings page. Its final hook state matches
  the snapshot. These writes also explain the file's later modification time.

The installed CLI reports version 0.163.0. The corresponding upstream code
shows that installation calls `set_user_plugin_enabled` for the selected
plugin. That helper updates its plugin-table `enabled` value and preserves
other config tables. Uninstallation removes the selected plugin table.

- [Install implementation](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/core-plugins/src/manager.rs#L2187)
- [Plugin config edits](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/config/src/plugin_edit.rs#L82)

The evidence attributes the hook changes to desktop settings activity and
the table move to the later desktop uninstall/reinstall. It does not support
the CLI refresh changing unrelated settings. The logs omit config-write
payloads, so they do not identify each individual toggle's request payload.

No live configuration was edited, no hooks were toggled and no plugin was
reinstalled during this investigation. No executable reproduction was needed.
