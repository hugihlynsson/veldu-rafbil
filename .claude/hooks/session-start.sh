#!/bin/bash
# Installs what `npm test`, `npm run typecheck` and `npm run lint` need, so a
# Claude Code on the web session can verify a change the way AGENTS.md asks it
# to. A fresh container clones the repo without node_modules, so without this
# the first check an agent runs fails with "vitest: not found".
set -euo pipefail

# Local checkouts install their own dependencies; only the web needs this.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# `install`, not `ci`: it reuses the cached container state on later sessions,
# and it runs the `prepare` script, which is what puts husky's pre-commit hook
# in place. That hook is the only thing that runs oxfmt over staged files --
# CI checks typecheck, lint and test, but never formatting -- so skipping it
# would let a session commit unformatted code with nothing to catch it.
npm install --no-audit --no-fund
