import assert from "node:assert/strict";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function fixture(t, runtime, pluginVersion = "1.3.2") {
  mkdirSync(join(root, "tmp"), { recursive: true });
  const repo = mkdtempSync(join(root, "tmp", "version-cli-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, "scripts"));
  copyFileSync(
    join(root, "scripts/sync-plugin-version.mjs"),
    join(repo, "scripts/sync-plugin-version.mjs"),
  );
  mkdirSync(join(repo, `.${runtime}-plugin`));
  writeFileSync(
    join(repo, "package.json"),
    JSON.stringify({ version: "1.3.2" }),
  );
  const manifest = join(repo, `.${runtime}-plugin/plugin.json`);
  writeFileSync(
    manifest,
    JSON.stringify(
      {
        name: `mattpocock-${runtime}`,
        version: pluginVersion,
        skills: ["./skills/engineering/tdd"],
      },
      null,
      2,
    ) + "\n",
  );
  return {
    repo,
    manifest,
    run: (...args) =>
      spawnSync(
        process.execPath,
        [join(repo, "scripts/sync-plugin-version.mjs"), ...args],
        { cwd: root, encoding: "utf8" },
      ),
  };
}

test("checks the owning Codex manifest without writing files", (t) => {
  const { manifest, run } = fixture(t, "codex");
  const before = readFileSync(manifest);
  const result = run("--check");
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readFileSync(manifest), before);
});

for (const runtime of ["codex", "claude"]) {
  test(`${runtime} rejects a version mismatch without changing either file`, (t) => {
    const { repo, manifest, run } = fixture(t, runtime, "1.2.0");
    const before = readFileSync(manifest);
    const packageBefore = readFileSync(join(repo, "package.json"));
    const result = run("--check");
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /plugin.json version is 1.2.0, package.json is 1.3.2/u,
    );
    assert.deepEqual(readFileSync(manifest), before);
    assert.deepEqual(readFileSync(join(repo, "package.json")), packageBefore);
  });

  test(`${runtime} writes only the mismatched version and then passes its check`, (t) => {
    const { repo, manifest, run } = fixture(t, runtime, "1.2.0");
    const before = readFileSync(manifest, "utf8");
    const packageBefore = readFileSync(join(repo, "package.json"));
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(manifest, "utf8"),
      before.replace('"version": "1.2.0"', '"version": "1.3.2"'),
    );
    assert.deepEqual(readFileSync(join(repo, "package.json")), packageBefore);
    assert.equal(run("--check").status, 0);
    const updated = readFileSync(manifest);
    assert.equal(run().status, 0);
    assert.deepEqual(readFileSync(manifest), updated);
  });
}

test("Codex build metadata still fails the exact version check without writing", (t) => {
  const { manifest, run } = fixture(t, "codex", "1.3.2+codex.20261101upstream");
  const before = readFileSync(manifest);
  assert.equal(run("--check").status, 1);
  assert.deepEqual(readFileSync(manifest), before);
});

test("a malformed Codex manifest fails instead of using another runtime's manifest", (t) => {
  const { repo, manifest, run } = fixture(t, "codex");
  const malformed = '{"version":';
  writeFileSync(manifest, malformed);
  mkdirSync(join(repo, ".claude-plugin"));
  const claude = join(repo, ".claude-plugin/plugin.json");
  const claudeBefore = '{"version":"1.3.2"}\n';
  writeFileSync(claude, claudeBefore);
  assert.equal(run().status, 1);
  assert.equal(readFileSync(manifest, "utf8"), malformed);
  assert.equal(readFileSync(claude, "utf8"), claudeBefore);
});

test("a missing runtime manifest fails without creating a replacement", (t) => {
  const { manifest, run } = fixture(t, "claude");
  rmSync(manifest);
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ENOENT/u);
});
