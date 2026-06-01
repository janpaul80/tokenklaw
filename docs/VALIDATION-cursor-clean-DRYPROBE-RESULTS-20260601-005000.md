# Cursor clean-room dry-probe results

Timestamp: 2026-06-01T00:50:00Z (approx)

This document records the non‑destructive dry‑probe execution for Cursor. Cursor is primarily a GUI-based IDE and does not expose a standard command‑line runner in the environment.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal Cursor path (not to be touched):
- C:\Users\hartm\.cursor

---

## Exact commands executed

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install cursor --dry-run
```

```powershell
where.exe cursor
Get-Command cursor -ErrorAction SilentlyContinue
```

## Dry-run JSON output

```json
{
  "ok": true,
  "dryRun": true,
  "install": {
    "agent": "cursor",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.cursor\\tokenklaw",
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
- No `cursor` executable found in PATH or as a PowerShell command.
- Cursor appears to be a GUI‑based IDE without a standard CLI launcher available in this environment.

## Conclusion
- TokenKlaw can generate Cursor artifacts under clean‑room.
- No runnable Cursor CLI was found.
- No consumption can be tested in headless mode.

**Status:** Investigation (no CLI found, consumption unproven)

---

Prepared by: Claude Code (dry‑probe)