import importlib.util
import json
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location("model_execution", Path(__file__).parents[1] / "model_execution.py")
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class ModelGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.ticket = self.root / "ticket with spaces.md"
        self.ticket.write_text("## Model recommendation\n### Codex\n"
                               "- Recommended model: test-codex\n"
                               "- Recommended reasoning level: high\n"
                               "### Claude Code\n- Recommended model: test-claude\n"
                               "- Recommended reasoning level: medium\n")
        self.transcript = self.root / "runtime.jsonl"

    def event(self, client="codex", model=None, effort=None, action="bind", agent=None):
        model = model or "test-" + client
        effort = effort or ("high" if client == "codex" else "medium")
        rows = ([{"type": "session_meta", "payload": {"id": "session"}},
                 {"type": "turn_context", "payload": {"turn_id": "turn", "model": model, "effort": effort}}]
                if client == "codex" else
                [{"type": "assistant", "sessionId": "session", "message": {
                    "model": model, "content": [{"type": "tool_use", "id": "tool"}]}}])
        self.transcript.write_text("\n".join(json.dumps(row) for row in rows) + "\n")
        command = ["python3", str(gate.SCRIPT), action]
        if action == "bind":
            command.append(str(self.ticket))
        return {"session_id": "session", "agent_id": agent, "turn_id": "turn",
                "transcript_path": str(self.transcript), "model": model,
                "effort": {"level": effort}, "cwd": str(self.root),
                "tool_name": "Bash", "tool_use_id": "tool",
                "tool_input": {"command": shlex.join(command)}}

    def run_gate(self, event, client="codex"):
        return gate.check(event, client, self.root / "state")

    def test_matching_native_evidence_both_clients(self):
        for client in gate.CLIENTS:
            with self.subTest(client=client):
                result = self.run_gate(self.event(client), client)["hookSpecificOutput"]
                self.assertEqual(result["permissionDecision"], "allow")
                receipt = json.loads(subprocess.check_output(result["updatedInput"]["command"], shell=True))
                self.assertEqual(receipt["status"], "verified")
                self.assertEqual(receipt["ticket"], str(self.ticket))

    def test_unassessed_tickets_need_no_runtime_or_binding(self):
        for client, other in (("codex", "Claude Code"), ("claude", "Codex")):
            for content in ("# Ordinary ticket", "## Model recommendation\n### " + other + "\n",
                            "## All models accessible\n### " + gate.CLIENTS[client] + "\n"):
                with self.subTest(client=client, content=content):
                    self.ticket.write_text(content)
                    event = self.event(client)
                    self.transcript.unlink()
                    event.pop("model")
                    event.pop("effort")
                    result = self.run_gate(event, client)["hookSpecificOutput"]
                    receipt = json.loads(subprocess.check_output(result["updatedInput"]["command"], shell=True))
                    self.assertEqual(receipt["status"], "not assessed")
                    self.assertNotIn("model", receipt)
                    self.assertFalse((self.root / "state").exists())
                    event["tool_name"] = "Write"
                    self.assertEqual(self.run_gate(event, client), {})

    def test_partial_current_client_assessment_still_blocks(self):
        for client in gate.CLIENTS:
            with self.subTest(client=client):
                self.ticket.write_text("## Model recommendation\n### " + gate.CLIENTS[client] +
                                       "\n- Recommended model: test-" + client + "\n")
                with self.assertRaisesRegex(ValueError, "ticket reasoning"):
                    self.run_gate(self.event(client), client)

    def test_bound_assessment_cannot_be_removed_to_bypass_gate(self):
        original = self.ticket.read_text()
        for client in gate.CLIENTS:
            with self.subTest(client=client):
                self.ticket.write_text(original)
                event = self.event(client)
                self.run_gate(event, client)
                self.ticket.write_text("# Assessment removed")
                with self.assertRaisesRegex(ValueError, "cannot become unassessed"):
                    self.run_gate(event, client)
                event["tool_name"] = "Write"
                with self.assertRaisesRegex(ValueError, "changed"):
                    self.run_gate(event, client)

    def test_mixed_workers_and_transition_after_finish(self):
        for client in gate.CLIENTS:
            with self.subTest(client=client):
                original = self.ticket.read_text()
                self.run_gate(self.event(client), client)
                assessed = self.ticket
                self.ticket = self.root / "unassessed.md"
                self.ticket.write_text("# Ordinary ticket")
                self.assertIn("not assessed", self.run_gate(self.event(client, agent="other"), client)
                              ["hookSpecificOutput"]["updatedInput"]["command"])
                with self.assertRaisesRegex(ValueError, "cannot become unassessed"):
                    self.run_gate(self.event(client), client)
                self.ticket = assessed
                self.run_gate(self.event(client, action="finish"), client)
                self.ticket.write_text("# Next ticket without assessment")
                self.assertIn("not assessed", self.run_gate(self.event(client), client)
                              ["hookSpecificOutput"]["updatedInput"]["command"])
                self.ticket.write_text(original)

    def test_model_and_effort_mismatches_block(self):
        for client in gate.CLIENTS:
            for override in ({"model": "wrong-model"}, {"effort": "low"}):
                with self.subTest(client=client, override=override):
                    with self.assertRaisesRegex(ValueError, "mismatch"):
                        self.run_gate(self.event(client, **override), client)

    def test_later_tool_and_resume_cannot_reuse_old_receipt(self):
        self.run_gate(self.event())
        event = self.event(effort="low", action="probe")
        event["tool_name"] = "apply_patch"
        event["tool_input"] = {"command": "edit code"}
        with self.assertRaisesRegex(ValueError, "mismatch"):
            self.run_gate(event)

    def test_current_turn_and_session_required(self):
        for field in ("turn_id", "session_id", "model"):
            event = self.event()
            event[field] = "wrong"
            with self.subTest(field=field), self.assertRaises(ValueError):
                self.run_gate(event)

    def test_claude_exact_tool_response_required(self):
        event = self.event("claude")
        event["tool_use_id"] = "different-tool"
        with self.assertRaisesRegex(ValueError, "unavailable"):
            self.run_gate(event, "claude")

    def test_claude_clamp_and_absent_effort_block(self):
        for effort in ({"level": "low"}, {}):
            event = self.event("claude")
            event["effort"] = effort
            with self.assertRaises(ValueError):
                self.run_gate(event, "claude")

    def test_lagging_and_malformed_transcript_block(self):
        for content in ("", '{"partial":'):
            event = self.event()
            self.transcript.write_text(content)
            with self.assertRaisesRegex(ValueError, "unavailable"):
                self.run_gate(event)

    def test_waits_for_current_claude_message_without_using_previous_one(self):
        event = self.event("claude")
        current = self.transcript.read_text()
        self.transcript.write_text(current.replace('"tool"', '"previous-tool"'))
        with patch.object(gate.time, "sleep", side_effect=lambda _: self.transcript.write_text(current)):
            self.assertEqual(gate.runtime(event, "claude"), ("test-claude", "medium"))

    def test_duplicate_headings_block_even_without_duplicate_fields(self):
        self.ticket.write_text(self.ticket.read_text() + "## Model recommendation\n### Codex\n")
        with self.assertRaisesRegex(ValueError, "one recommendation"):
            self.run_gate(self.event())

    def test_missing_duplicate_and_non_executable_recommendations_block(self):
        original = self.ticket.read_text()
        for content in ("## Model recommendation\n### Codex\n", original + "- Recommended model: duplicate\n",
                        original.replace("test-codex", "not applicable"),
                        original.replace("high", "undetermined")):
            self.ticket.write_text(content)
            client = "claude" if "duplicate" in content else "codex"
            with self.assertRaises(ValueError):
                self.run_gate(self.event(client), client)

    def test_invalid_bind_leaves_gate_closed(self):
        self.ticket.write_text("## Model recommendation\n### Codex\n")
        event = self.event()
        with self.assertRaises(ValueError):
            self.run_gate(event)
        event["tool_name"] = "Write"
        with self.assertRaises(ValueError):
            self.run_gate(event)

    def test_changed_recommendation_blocks(self):
        event = self.event()
        self.run_gate(event)
        self.ticket.write_text(self.ticket.read_text().replace("high", "low"))
        event["tool_name"] = "Write"
        with self.assertRaisesRegex(ValueError, "changed"):
            self.run_gate(event)

    def test_other_client_and_hypothetical_fields_are_not_selected(self):
        self.ticket.write_text(self.ticket.read_text() + "## All models accessible\n"
                               "### Codex\n- Recommended model: hypothetical\n"
                               "- Recommended reasoning level: max\n")
        self.run_gate(self.event())

    def test_actor_isolation_and_directory_change(self):
        self.run_gate(self.event())
        other = self.event(model="other", agent="worker")
        other["tool_name"] = "Write"
        self.assertEqual(self.run_gate(other), {})
        event = self.event(action="probe")
        event["cwd"] = str(self.root / "other")
        with self.assertRaisesRegex(ValueError, "directory changed"):
            self.run_gate(event)

    def test_finish_verifies_and_cleans_binding(self):
        self.run_gate(self.event())
        with self.assertRaisesRegex(ValueError, "mismatch"):
            self.run_gate(self.event(effort="low", action="finish"))
        self.run_gate(self.event(action="finish"))
        self.assertFalse(list((self.root / "state/model-execution").glob("*.json")))

    def test_abort_cleans_without_claiming_completion(self):
        self.run_gate(self.event())
        result = self.run_gate(self.event(effort="low", action="abort"))
        self.assertIn("aborted", result["hookSpecificOutput"]["updatedInput"]["command"])
        self.assertFalse(list((self.root / "state/model-execution").glob("*.json")))

    def test_normal_tool_keeps_permission_checks(self):
        event = self.event()
        self.run_gate(event)
        event["tool_name"] = "mcp__filesystem__write"
        result = self.run_gate(event)
        self.assertNotIn("permissionDecision", result["hookSpecificOutput"])

    def test_unrelated_calls_are_unchanged(self):
        event = self.event()
        event["tool_name"] = "Read"
        self.assertEqual(self.run_gate(event), {})

    def test_disabled_hook_control_command_fails(self):
        result = subprocess.run([sys.executable, str(gate.SCRIPT), "probe"], capture_output=True)
        self.assertEqual(result.returncode, 2)

    def test_malformed_hook_input_denies(self):
        result = subprocess.run([sys.executable, str(gate.SCRIPT), "hook", "codex"],
                                input=b"not json", capture_output=True)
        self.assertEqual(json.loads(result.stdout)["hookSpecificOutput"]["permissionDecision"], "deny")

    def test_control_command_cannot_hide_chained_work(self):
        event = self.event()
        event["tool_input"]["command"] += "; touch unwanted"
        self.assertIsNone(gate.control(event))


if __name__ == "__main__":
    unittest.main()
