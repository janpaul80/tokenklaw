# Cline clean-room dry-probe results

Timestamp: 2026-06-01T01:00:00Z (approx)

This document records the non‑destructive dry‑probe execution for Cline. Cline is a VS Code extension (fork of Continue) and does not expose a standalone CLI.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal Cline path (not to be touched):
- C:\Users\hartm\.cline

---

## Exact commands executed

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install cline --dry-run
```

```powershell
where.exe cline
Get-Command cline -ErrorAction SilentlyContinue
```

## Dry-run JSON output

```json
{
  "ok": true,
  "dryRun": true,
  "install": {
    "agent": "cline",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.cline\\tokenklaw",
    "written": [
      "tokenklaw.rules.md",
      "tokenklaw.skill.md",
      "tokenklaw.prompt.md",
      "tokenklaw.slash-commands.md",
      "runtime-capabilities.json",
      "runtime-notes.md"
    ],
    "dryRun": true
  }
}
```

## PATH discovery
- No `cline` executable found in PATH.
- Cline is a VS Code IDE extension, not a standalone CLI.

## Conclusion
- TokenKlaw can generate Cline artifacts under clean‑room.
- No runnable Cline CLI found.
- Consumption testing requires IDE integration.

**Status:** Investigation (no CLI found, consumption unproven)

---

## Runtime Matrix Summary

| Runtime | Status | Evidence |
|---------|--------|----------|
| OpenClaw | Scaffolded — isolated install verified | CLI artifacts generated; no runtime binary found |
| Hermes | Scaffolded — runtime not found | CLI artifacts generated; no runtime binary found |
| Codex | Investigation | CLI 0.130.0 found; TokenKlaw consumption unproven |
| OpenCode | Investigation | CLI 1.15.13 found; TokenKlaw consumption unproven |
| Cursor | Investigation | GUI IDE; no CLI found |
| Continue | Investigation | IDE plugin; no CLI found |
| Cline | Investigation | IDE plugin; no CLI found |

---

Prepared by: Claude Code (dry‑probe)