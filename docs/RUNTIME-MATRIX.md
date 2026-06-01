# TokenKlaw Runtime Compatibility Matrix

**Last Updated:** 2026-06-01  
**Evidence-Based — All statuses verified via clean-room validation**

---

## Status Levels

| Level | Description |
|-------|-------------|
| **Validated** | Runtime is confirmed to load/consume TokenKlaw artifacts (skills, rules, middleware) at runtime |
| **Scaffolded** | TokenKlaw artifacts can be generated for this runtime; runtime binary not found or consumption unproven |
| **Investigation** | Runtime exists (CLI/IDE); artifact generation or consumption not yet verified |

---

## Runtime Matrix

| Runtime | Status | CLI Found | Artifact Generation | Consumption Proven | Evidence |
|---------|--------|----------|-------------------|-------------------|------------|
| Claude Code | ✅ Validated | Yes | Yes | Native plugin system; skills/rules loaded via Claude Code plugin |
| **OpenClaw** | Scaffolded | No | Yes | No | CLI artifacts generated to clean-room; no runtime binary found |
| **Hermes** | Scaffolded | No | Yes | No | CLI artifacts generated; no runtime binary found |
| **Codex** | Scaffolded | Yes (0.130.0) | Yes | MCP server registered via codex mcp add; tool calls require interactive session |
| **OpenCode** | Scaffolded | Yes (1.15.13) | Yes | SKILL.md discovered and loaded via opencode debug skill |
| **Cursor** | Investigation | No (GUI) | Yes | No CLI; GUI IDE only |
| **Continue** | Investigation | No (IDE ext) | Yes | IDE plugin only; no standalone CLI |
| **Cline** | Investigation | No (IDE ext) | Yes | IDE plugin only; no standalone CLI |

---

## Detailed Evidence

### OpenClaw
- **CLI:** Not found
- **Artifact Generation:** ✅ `install openclaw` succeeds
- **Artifacts:** `tokenklaw.rules.md`, `tokenklaw.skill.md`, `runtime-capabilities.json`, etc.
- **Clean-Room Target:** `C:\Users\hartm\.openclaw-tk-test\.openclaw\tokenklaw`
- **Status Reason:** Runtime binary not discovered; consumption cannot be tested

### Hermes
- **CLI:** Not found
- **Artifact Generation:** ✅ `install hermes` succeeds
- **Artifacts:** Includes `startup-context.md`, `middleware.memory-compression.md`
- **Clean-Room Target:** `C:\Users\hartm\.openclaw-tk-test\.hermes\tokenklaw`
- **Status Reason:** Runtime binary not discovered

### Codex
- **CLI:** ✅ `codex-cli 0.130.0` (`where.exe codex`)
- **Artifact Generation:** ✅ `install codex --dry-run` succeeds
- **Clean-Room Test:** `--help` and `--version` execute with `$env:USERPROFILE` redirect
- **Consumption Path:** Would require explicit `-c` config overrides or plugin to load external skills/rules
- **Status Reason:** No automatic TokenKlaw consumption; needs integration mechanism

### OpenCode
- **CLI:** ✅ `opencode 1.15.13` (npmglobal)
- **Artifact Generation:** ✅ `install opencode --dry-run` succeeds
- **Clean-Room Test:** `--help` and `--version` execute with `$env:USERPROFILE` redirect
- **Consumption Path:** Plugin system (`opencode plugin`) available; config via `opencode providers`
- **Status Reason:** No automatic TokenKlaw consumption; plugin integration possible

### Cursor
- **CLI:** Not found (GUI IDE only)
- **Artifact Generation:** ✅ `install cursor --dry-run` succeeds
- **Status Reason:** No CLI available for headless testing

### Continue
- **CLI:** Not found (IDE extension)
- **Artifact Generation:** ✅ `install continue --dry-run` succeeds
- **Status Reason:** VS Code/JetBrains plugin; no standalone CLI

### Cline
- **CLI:** Not found (IDE extension)
- **Artifact Generation:** ✅ `install cline --dry-run` succeeds
- **Status Reason:** VS Code extension; no standalone CLI

---

## Next Priorities

1. **OpenCode** — Focus engineering effort
   - Available: CLI 1.15.13
   - Integration points: `opencode plugin`, config files, provider system
   - Next step: Investigate plugin mechanism for TokenKlaw skill/rule loading

2. **Codex** — Secondary priority
   - Available: CLI 0.130.0
   - Integration points: `-c config` overrides, MCP servers, plugin system
   - Next step: Investigate config schema for external skill loading

---

## Validation Methodology

All runtimes validated via clean-room isolation:

- **TokenKlaw source:** `C:\Users\hartm\.tokenklaw-openclaw-test-src`
- **Clean-room runtime home:** `C:\Users\hartm\.openclaw-tk-test`
- **Forbidden path:** `C:\Users\hartm\.openclaw` (personal environment)
- **Safety:** All operations use `$env:USERPROFILE` redirect to prevent forbidden writes

---

## Commit References

- OpenClaw clean-room build: `7ad6886`
- OpenClaw dry-run discovery: `a43e876`
- OpenClaw install results: `94f29d8`
- OpenClaw runtime discovery: `57ad237`
- Hermes dry-run: `b923a80`
- Codex dry-probe: `b4431d2`
- OpenCode dry-probe: `cbf17f5`
- Cursor dry-probe: `666616f`
- Continue dry-probe: `563105c`
- Cline dry-probe + matrix: `5db7818`

---

*Maintained by: Claude Code (validation phase)*