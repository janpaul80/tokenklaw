# Continue clean-room dry-probe results

Timestamp: 2026-06-01T00:55:00Z (approx)

This document records the non‑destructive dry‑probe execution for Continue. Continue is a VS Code / JetBrains IDE extension and does not expose a standalone CLI.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal continue path (not to be touched):
- C:\Users\hartm\.continue

---

## Exact commands executed

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install continue --dry-run
```

```powershell
where.exe continue
Get-Command continue -ErrorAction SilentlyContinue
```

## Dry-run JSON output

```json
{
  "ok": true,
  "dryRun": true,
  "install": {
    "agent": "continue",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.continue\\tokenklaw",
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
- No `continue` executable found in PATH.
- Continue is primarily a VS Code / JetBrains IDE plugin/extension, not a standalone CLI.

## Conclusion
- TokenKlaw can generate Continue artifacts under clean‑room.
- No runnable Continue CLI found.
- Consumption testing would require IDE integration, not applicable in headless mode.

**Status:** Investigation (no CLI found, consumption unproven)

---

Prepared by: Claude Code (dry‑probe)