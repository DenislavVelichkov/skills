---
name: setup-pre-commit
description: Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
---

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- **lint-staged** running Prettier on all staged files
- **Prettier** config (if missing)
- **typecheck** and **test** scripts in the pre-commit hook

## Steps

### 1. Detect package manager

Check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun). Use whichever is present. Default to npm if unclear.

Read the existing hook setup, `core.hooksPath`, `prepare` script, lint-staged configuration and Prettier configuration before changing them. Record the initial staging state. Preserve existing commands and formatting rules; merge this setup without duplicating it. Resolve a conflicting hook manager before changing its activation.

### 2. Install dependencies

Install as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

Use initialization only for a new Husky setup. Preserve an existing `prepare` command when adding Husky, and keep existing hook commands when adapting generated files. An existing Husky setup needs only the missing changes.

### 4. Create `.husky/pre-commit`

Add the missing commands to this file, preserving existing checks. A new Husky v9+ hook needs no shebang:

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**: Replace `npm` with detected package manager. If repo has no `typecheck` or `test` script in package.json, omit those lines and tell the user.

### 5. Create `.lintstagedrc`

Use the existing lint-staged configuration when present. Add a Prettier command only where existing rules do not already cover the files, and preserve other tasks. Create this file only when no lint-staged configuration exists:

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (if missing)

Only create if no Prettier config exists. Use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` exists and is executable
- [ ] The active lint-staged configuration includes the intended formatting rule
- [ ] `prepare` initializes Husky and retains any prior setup command
- [ ] `prettier` config exists
- [ ] Run the configured checks against this task's staged changes. Preserve unrelated index and working-tree content; use an isolated checkout if existing staged work cannot be separated safely.

Correct setup faults once and rerun affected checks. Report remaining failures before committing.

### 8. Commit

Stage only this task's changed files or hunks and inspect the staged diff before committing with message: `Add pre-commit hooks (husky + lint-staged + prettier)`. Do not include or discard unrelated staged work; report if it prevents a scoped commit.

This will run through the new pre-commit hooks: a good smoke test that everything works.

## Notes

- Husky v9+ doesn't need shebangs in hook files
- `prettier --ignore-unknown` skips files Prettier can't parse (images, etc.)
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests
