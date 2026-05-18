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
  --help               Show help

Examples:
  bash install.sh --runtime claude
  bash install.sh --runtime all --dir "$HOME/dev/tokenklaw"
EOF
}

log() { printf "\033[1;34m[TokenKlaw]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[TokenKlaw]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[TokenKlaw]\033[0m %s\n" "$*" >&2; }

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Missing required command: $cmd"
    exit 1
  fi
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --runtime)
        RUNTIME="${2:-}"
        shift 2
        ;;
      --dir)
        INSTALL_DIR="${2:-}"
        shift 2
        ;;
      --skip-build)
        SKIP_BUILD="true"
        shift
        ;;
      --non-interactive)
        NON_INTERACTIVE="true"
        shift
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        err "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
  done
}

detect_os() {
  local uname_out
  uname_out="$(uname -s || true)"
  case "${uname_out}" in
    Linux*) echo "linux" ;;
    Darwin*) echo "macos" ;;
    *) echo "unknown" ;;
  esac
}

is_wsl() {
  if grep -qiE "(microsoft|wsl)" /proc/version 2>/dev/null; then
    return 0
  fi
  return 1
}

ensure_node() {
  if ! command -v node >/dev/null 2>&1; then
    err "Node.js is required but not found. Install Node 20+ and rerun."
    exit 1
  fi
  log "Node detected: $(node -v)"
}

ensure_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    log "pnpm detected: $(pnpm -v)"
    return
  fi

  warn "pnpm not found. Attempting Corepack enable..."
  if command -v corepack >/dev/null 2>&1; then
    if corepack enable >/dev/null 2>&1 && corepack prepare pnpm@latest --activate >/dev/null 2>&1; then
      log "pnpm enabled via Corepack."
      return
    fi
    warn "Corepack path failed. Falling back to npm -g install pnpm."
  else
    warn "Corepack not found. Falling back to npm -g install pnpm."
  fi

  require_cmd npm
  npm install -g pnpm
  log "pnpm installed: $(pnpm -v)"
}

clone_or_update_repo() {
  mkdir -p "$(dirname "$INSTALL_DIR")"

  if [[ -d "$INSTALL_DIR/.git" ]]; then
    log "Existing TokenKlaw repo found at: $INSTALL_DIR"
    git -C "$INSTALL_DIR" fetch --all --prune
    git -C "$INSTALL_DIR" pull --ff-only
  else
    log "Cloning TokenKlaw into: $INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR"
  fi
}

run_install_flow() {
  log "Installing dependencies..."
  pnpm -C "$INSTALL_DIR" install

  if [[ "$SKIP_BUILD" != "true" ]]; then
    log "Building workspace..."
    pnpm -C "$INSTALL_DIR" -r build
  else
    warn "Skipping build per --skip-build"
    if [[ ! -f "$INSTALL_DIR/apps/cli/dist/index.js" ]]; then
      warn "CLI dist missing while --skip-build is set. Building required workspace dependency chain."
      pnpm -C "$INSTALL_DIR" --filter @tokenklaw/shared run build
      pnpm -C "$INSTALL_DIR" --filter @tokenklaw/providers run build
      pnpm -C "$INSTALL_DIR" --filter @tokenklaw/analytics run build
      pnpm -C "$INSTALL_DIR" --filter @tokenklaw/core run build
      pnpm -C "$INSTALL_DIR" --filter @tokenklaw/cli run build
    fi
  fi

  if [[ ! -f "$INSTALL_DIR/apps/cli/dist/index.js" ]]; then
    err "CLI binary not found at $INSTALL_DIR/apps/cli/dist/index.js after build step."
    exit 1
  fi

  log "Running doctor..."
  node "$INSTALL_DIR/apps/cli/dist/index.js" doctor
}

normalize_runtime() {
  local value="${1:-}"
  case "$value" in
    antigravity) echo "gemini" ;;
    claude|gemini|openclaw|hermes|roo|cursor|cline|all|"") echo "$value" ;;
    *)
      err "Unsupported runtime: $value"
      err "Supported: claude, gemini, antigravity, openclaw, hermes, roo, cursor, cline, all"
      exit 1
      ;;
  esac
}

runtime_status() {
  cat <<'EOF'
Runtime status:
- Claude Code: working plugin integration
- Gemini / Antigravity: experimental
- OpenClaw: experimental
- Hermes: experimental
- Roo/Cursor/Cline: pending validation
EOF
}

interactive_runtime_menu() {
  echo
  echo "Where do you want to install TokenKlaw?"
  echo
  echo "[1] Claude Code"
  echo "[2] Gemini / Antigravity"
  echo "[3] OpenClaw"
  echo "[4] Hermes"
  echo "[5] Roo Code"
  echo "[6] Cursor"
  echo "[7] Cline"
  echo "[A] All"
  echo "[S] Skip agent install for now"
  echo
  read -r -p "Select option: " choice
  case "${choice^^}" in
    1) RUNTIME="claude" ;;
    2) RUNTIME="gemini" ;;
    3) RUNTIME="openclaw" ;;
    4) RUNTIME="hermes" ;;
    5) RUNTIME="roo" ;;
    6) RUNTIME="cursor" ;;
    7) RUNTIME="cline" ;;
    A) RUNTIME="all" ;;
    S) RUNTIME="" ;;
    *)
      warn "Invalid selection. Skipping agent install."
      RUNTIME=""
      ;;
  esac
}

run_runtime_install() {
  if [[ -z "$RUNTIME" && "$NON_INTERACTIVE" != "true" ]]; then
    interactive_runtime_menu
  fi

  RUNTIME="$(normalize_runtime "$RUNTIME")"

  if [[ -z "$RUNTIME" ]]; then
    log "Skipping runtime install."
    runtime_status
    return
  fi
  if [[ ! -f "$INSTALL_DIR/apps/cli/dist/index.js" ]]; then
    err "CLI binary not found at $INSTALL_DIR/apps/cli/dist/index.js"
    err "Run without --skip-build or build @tokenklaw/cli first."
    exit 1
  fi
  log "Installing runtime artifacts for: $RUNTIME"
  node "$INSTALL_DIR/apps/cli/dist/index.js" install "$RUNTIME"
  runtime_status
}

main() {
  parse_args "$@"

  local os
  os="$(detect_os)"
  if [[ "$os" == "unknown" ]]; then
    warn "Unknown OS detected. Proceeding with best-effort install."
  else
    log "OS detected: $os"
  fi
  if is_wsl; then
    log "WSL environment detected."
  fi

  require_cmd git
  ensure_node
  ensure_pnpm
  clone_or_update_repo
  run_install_flow
  run_runtime_install

  log "Installation complete."
  log "Repo: $INSTALL_DIR"
  log "Run: node $INSTALL_DIR/apps/cli/dist/index.js --help"
}

main "$@"
