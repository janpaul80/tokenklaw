#!/usr/bin/env bash
set -euo pipefail

RUNTIME=""
INSTALL_DIR="${HOME}/tokenklaw"
SKIP_BUILD="false"
REPO_URL="https://github.com/janpaul80/tokenklaw.git"
NON_INTERACTIVE="false"

usage() {
  cat <<'EOF'
TokenKlaw one-line installer (macOS / Linux / WSL)

Usage:
  bash install.sh [options]

Options:
  --runtime <id|all>   Optional runtime install after build (claude|gemini|antigravity|openclaw|hermes|roo|cursor|cline|all)
  --dir <path>         Install/update directory (default: ~/tokenklaw)
  --skip-build         Skip pnpm build step
EOF
}

# Rest of the script omitted for brevity – the full file is at
# https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh
