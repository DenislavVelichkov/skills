#!/usr/bin/env python3
"""Check ticket settings against native PreToolUse evidence, never caller assertions."""

import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import sys
import tempfile
import time


SCRIPT = Path(__file__).resolve()
CLIENTS = {"codex": "Codex", "claude": "Claude Code"}


def required(value, name):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"Missing runtime {name}; implementation is blocked")
    return value


def recommendation(path, client):
    text = Path(path).read_text(encoding="utf-8")
    section = subsection = False
    sections = clients = 0
    fields = {}
    for line in text.splitlines():
        heading = re.fullmatch(r"(#{1,6})\s+(.+?)\s*", line)
        if heading:
            depth, title = len(heading[1]), heading[2]
            if depth <= 2:
                section = depth == 2 and title == "Model recommendation"
                subsection = False
                sections += int(section)
            elif depth == 3:
                subsection = section and title == CLIENTS[client]
                clients += int(subsection)
        if section and subsection:
            field = re.fullmatch(r"- Recommended (model|reasoning level):\s*`?([^`]+?)`?\s*", line)
            if field:
                if field[1] in fields:
                    raise ValueError("Duplicate recommendation field; reassess the ticket")
                fields[field[1]] = field[2]
    if sections != 1 or clients != 1:
        raise ValueError("Ticket requires one recommendation section and one current-client subsection")
    model = required(fields.get("model"), "ticket model recommendation")
    effort = required(fields.get("reasoning level"), "ticket reasoning recommendation")
    if model in {"not applicable", "undetermined"} or effort in {"not applicable", "undetermined"}:
        raise ValueError("Ticket has no executable recommendation")
    return model, effort


def runtime(event, client):
    transcript = Path(required(event.get("transcript_path"), "transcript path"))
    turn = event.get("turn_id")
    tool = required(event.get("tool_use_id"), "tool-use ID")
    match = None
    session = None
    # shortcut: native transcript schemas can change; update adapters if evidence stops matching.
    for attempt in range(11):
        with transcript.open(encoding="utf-8") as stream:
            for line in stream:
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if client == "codex":
                    if row.get("type") == "session_meta":
                        session = row["payload"].get("id")
                    if row.get("type") == "turn_context" and row["payload"].get("turn_id") == turn:
                        match = row["payload"]
                elif row.get("type") == "assistant":
                    message = row.get("message", {})
                    if any(item.get("type") == "tool_use" and item.get("id") == tool
                           for item in message.get("content", []) if isinstance(item, dict)):
                        if row.get("sessionId") != event.get("session_id"):
                            raise ValueError("Claude transcript session does not match the hook")
                        match = message
        if match is not None or attempt == 10:
            break
        # Claude may flush its current assistant message just after PreToolUse begins.
        time.sleep(0.1)
    if match is None:
        raise ValueError("Current runtime evidence is unavailable; do not use an older turn")
    model = required(match.get("model"), "model")
    if client == "codex":
        required(turn, "turn ID")
        if session != event.get("session_id") or model != event.get("model"):
            raise ValueError("Codex transcript and hook identity/model disagree")
        effort = required(match.get("effort"), "reasoning effort")
    else:
        effort = required(event.get("effort", {}).get("level"), "reasoning effort")
    return model, effort


def control(event):
    if event.get("tool_name") != "Bash":
        return None
    command = event.get("tool_input", {}).get("command", "")
    try:
        args = shlex.split(command)
    except ValueError:
        return None
    if len(args) not in (3, 4) or Path(args[0]).name not in {"python3", "python"}:
        return None
    if Path(args[1]).resolve() != SCRIPT:
        return None
    if args[2] in {"probe", "finish", "abort"} and len(args) == 3:
        return args[2], None
    if args[2] == "bind" and len(args) == 4:
        return "bind", str(Path(args[3]).resolve())
    return None


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, temporary = tempfile.mkstemp(dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(data, stream)
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def check(event, client, data_dir):
    action = control(event)
    identity = [client, required(event.get("session_id"), "session ID"),
                event.get("agent_id"), event.get("transcript_path")]
    key = hashlib.sha256(json.dumps(identity).encode()).hexdigest()
    state_path = Path(data_dir) / "model-execution" / (key + ".json")
    if not action and not state_path.exists():
        return {}
    if action and action[0] == "abort":
        state_path.unlink(missing_ok=True)
        return rewrite(event, {"status": "aborted", "instruction": "Stop implementation now"})
    if action and action[0] == "bind":
        save(state_path, {"ticket": action[1], "model": None, "effort": None,
                          "cwd": str(Path(event["cwd"]).resolve())})
        model, effort = recommendation(action[1], client)
        state = {"ticket": action[1], "model": model, "effort": effort,
                 "cwd": str(Path(event["cwd"]).resolve())}
        save(state_path, state)
    state = json.loads(state_path.read_text()) if state_path.exists() else None
    model, effort = runtime(event, client)
    if state:
        if str(Path(event["cwd"]).resolve()) != state["cwd"]:
            raise ValueError("Working directory changed; rebind the ticket before implementation")
        if recommendation(state["ticket"], client) != (state["model"], state["effort"]):
            raise ValueError("Ticket recommendation changed; reassess and rebind")
        if (model, effort) != (state["model"], state["effort"]):
            raise ValueError(f"Model gate mismatch: expected {state['model']} / {state['effort']}; "
                             f"runtime is {model} / {effort}. Stop; switch settings and rebind")
    elif not action or action[0] != "probe":
        raise ValueError("No ticket is bound; run bind before implementation")
    receipt = {"status": "verified" if state else "runtime observed", "client": client,
               "session": identity[1], "agent": identity[2], "model": model, "effort": effort,
               "tool_use_id": event["tool_use_id"], "turn_id": event.get("turn_id"),
               "ticket": state["ticket"] if state else None}
    if action:
        if action[0] == "finish":
            state_path.unlink()
        return rewrite(event, receipt)
    return {"hookSpecificOutput": {"hookEventName": "PreToolUse",
                                   "additionalContext": "Model gate: " + json.dumps(receipt)}}


def rewrite(event, receipt):
    # Only the exact control command is replaced; normal tool approvals are preserved.
    return {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow",
            "updatedInput": {**event["tool_input"],
                             "command": "printf '%s\\n' " + shlex.quote(json.dumps(receipt))}}}


def main():
    if len(sys.argv) != 3 or sys.argv[1] != "hook" or sys.argv[2] not in CLIENTS:
        print("Model gate hook did not intercept this command. Stop implementation; "
              "install, enable and trust the plugin hook, then retry.", file=sys.stderr)
        return 2
    try:
        event = json.load(sys.stdin)
        data_dir = required(os.environ.get("PLUGIN_DATA") or os.environ.get("CLAUDE_PLUGIN_DATA"),
                            "plugin data directory")
        result = check(event, sys.argv[2], data_dir)
    except Exception as error:
        result = {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny",
                                         "permissionDecisionReason": "Model gate: " + str(error)}}
    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    sys.exit(main())
