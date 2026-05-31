# OpenClaw Integration Investigation

**Status**: Experimental (Scaffolded) - Gap Analysis Complete  
**Last Updated**: 2026-05-31  
**Investigator**: Claude Code (TokenKlaw)

## Executive Summary

OpenClaw is a real Rust-based runtime. Gap Analysis reveals the TokenKlaw installation target is incorrect.

## Actual Runtime Locations Found

| Component | Directory | Details |
|------------|----------|---------|
| **Main project** | `~/zeroclaw/` | Full Rust project (not .openclaw) |
| Config | `zeroclaw/crates/zeroclaw-config/src/` | policy.rs, secrets.rs, skill_bundles.rs |
| Memory | `zeroclaw/crates/zeroclaw-memory/src/` | sqlite.rs, qdrant.rs, lucid.rs, postgres.rs |
| Plugins | `zeroclaw/crates/zeroclaw-plugins/src/` | host.rs, runtime.rs, wasm_channel.rs |
| Runtime | `zeroclaw/crates/zeroclaw-runtime/src/` | agent/, hooks/, daemon/, health/ |
| Skills | `zeroclaw/crates/zeroclaw-config/src/skill_bundles.rs` | Built-in skill system |

## TokenKlaw Installation

**Current target**: `~/.openclaw/tokenklaw/`

**Files generated**:
```
~/.openclaw/tokenklaw/
  SOUL.md
  middleware.token-compression.md
  tokenklaw.rules.md
  tokenklaw.skill.md
  tokenklaw.prompt.md
  tokenklaw.slash-commands.md
  runtime-capabilities.json
  runtime-notes.md
```

## Gap Analysis

| TokenKlaw Writes | OpenClaw Reads | Gap? |
|------------------|----------------|------|
| `~/.openclaw/tokenklaw/` | `~/zeroclaw/crates/*/` | ⚠️ **WRONG PATH** |

**Critical Finding**: TokenKlaw writes to `.openclaw/` but the actual OpenClaw runtime at `zeroclaw/` is a Rust project that reads from its internal crates, not from `.openclaw/`.

## Integration Opportunities

### If integrating with real OpenClaw (zeroclaw)

1. **Skills injection**: Write to `zeroclaw/crates/zeroclaw-config/src/skill_bundles.rs` or equivalent
2. **Memory layer**: Integrate with `zeroclaw/crates/zeroclaw-memory/src/`
3. **Plugin system**: Use WASM plugin system in `zeroclaw/crates/zeroclaw-plugins/src/`
4. **Hooks**: Add to `zeroclaw/crates/zeroclaw-runtime/src/hooks/`

### Current status

**Remain at "Scaffolded"** until real integration path is proven.

## Next Steps

1. Confirm whether to integrate with Rust zeroclaw or a different runtime
2. If zeroclaw: determine actual user-facing config/skills API
3. Update TokenKlaw installer to target correct location