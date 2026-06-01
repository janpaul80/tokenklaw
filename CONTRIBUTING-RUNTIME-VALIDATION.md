# TokenKlaw Runtime Validation Guidelines

This document defines the evidence requirements for runtime classification changes in TokenKlaw.

---

## Status Levels

### Investigation → Scaffolded

**Requirements:**
1. ✅ Clean-room directory created
2. ✅ TokenKlaw artifact generation (`install <runtime> --dry-run`) succeeds
3. ✅ Target paths are inside `C:\Users\hartm\.openclaw-tk-test` (do not touch personal dirs)
4. ✅ Runtime CLI found (if applicable) OR integration mechanism verified

**Evidence to capture:**
- Commands executed (verbatim)
- JSON output / file listing
- stdout/stderr captured

---

### Scaffolded → Validated

**Requirements:**
1. ✅ Integration proven at protocol level (MCP/SKILL/config)
2. ✅ Runtime actually loads TokenKlaw artifacts at runtime
3. ✅ At least one TokenKlaw command executed successfully

**Evidence to capture:**
- Runtime tool/list showing TokenKlaw tools (e.g., `opencode debug skill`)
- MCP tool enumeration (e.g., `codex mcp list`)
- Console output or logs showing TokenKlaw activation

---

## Validation Methodology

### Clean-Room Testing

All runtime validations MUST use the clean-room environment:

```powershell
# approved directories
$tokenklawSource = "C:\Users\hartm\.tokenklaw-openclaw-test-src"
$runtimeHome = "C:\Users\hartm\.openclaw-tk-test"

# NEVER touch
$personal = "C:\Users\hartm\.openclaw"
```

### Environment Override

For testing without modifying personal configs:
```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
# commands now target clean-room
```

---

## Evidence Checklist

For each runtime investigation, capture:

- [ ] Date of investigation
- [ ] Commands executed (exact)
- [ ] stdout/stderr outputs
- [ ] Files created/modified
- [ ] Runtime version discovered
- [ ] Integration path (MCP/plugin/skill/config)
- [ ] Blocking: credentials required for full validation?

---

## Current Validation Targets

| Priority | Runtime | Next Step |
|----------|---------|----------|
| 1 | Codex | Runtime invocation (await user credentials) |
| 2 | OpenClaw | Runtime binary discovery |
| 3 | Hermes | Runtime binary discovery |
| 4 | Cursor | IDE integration path |
| 5 | Continue | IDE integration path |
| 6 | Cline | IDE integration path |

---

## Commit Standards

All validation evidence must include:

1. **Results document:** `docs/VALIDATION-<runtime>-<phase>-<date>.md`
2. **Commit message:** Clear classification change
3. **Matrix update:** Update `docs/runtime-matrix.json`

---

*Guidelines by: Claude Code (validation framework)*