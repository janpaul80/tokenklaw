# Codex clean-room dry-probe results

Timestamp: 2026-06-01T00:30:00Z (approx)

This document records the non‑destructive dry‑probe execution for the Codex CLI executed with USERPROFILE redirected into the approved clean‑room runtime home. All runs were read‑only with no model calls or authentication.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal Codex path (not to be touched):
- C:\Users\hartm\.codex

---

## Exact commands executed (verbatim)

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
codex --help

$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
codex --version
```

## Captured outputs

### codex --help (excerpt)
- Full help text printed, showing subcommands: exec, review, login, logout, mcp, plugin, mcp-server, app-server, completion, update, sandbox, debug, apply, resume, fork, cloud, exec-server, features, help
- Configuration options: `-c`, `--config <key=value>` for config overrides
- Sandbox modes: read-only, workspace-write, danger-full-access
- Profile support: `--profile <CONFIG_PROFILE>`
- Model options: `-m`, `--model`, `--oss`, `--local-provider`

### codex --version
- `codex-cli 0.130.0`

## Target path / environment
- USERPROFILE redirected to clean-room: `C:\Users\hartm\.openclaw-tk-test`
- No files accessed in personal `C:\Users\hartm\.codex`

## Files accessed / modified
- None during read‑only help/version probes.

## Whether Codex consumed TokenKlaw artifacts
- No evidence of TokenKlaw artifact consumption. Codex requires explicit configuration (e.g., plugin or `-c` config overrides) to load external skills/rules. By default, it references `~/.codex/config.toml`.

## Conclusion
- Codex CLI runs successfully under redirected USERPROFILE in the clean-room environment.
- Version 0.130.0 discovered.
- No TokenKlaw artifact consumption was observed — would require explicit config to point Codex at TokenKlaw skill/rule files.

**Status:** Investigation (consumption unproven)

---

Prepared by: Claude Code (dry‑probe)