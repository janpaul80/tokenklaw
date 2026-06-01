# Hermes clean-room dry-run results

Timestamp: 2026-06-01T00:00:00Z (approx)

This document records the non-destructive dry-run probe for the Hermes runtime adapter using the TokenKlaw CLI, executed with USERPROFILE redirected into the approved clean-room runtime home.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal Hermes path (not to be touched):
- C:\Users\hartm\.hermes

---

## Exact command executed

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install hermes --dry-run
```

## JSON output (excerpt)

```json
{
  "ok": true,
  "dryRun": true,
  "install": {
    "agent": "hermes",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.hermes\\tokenklaw",
    "written": [
      "tokenklaw.rules.md",
      "tokenklaw.skill.md",
      "tokenklaw.prompt.md",
      "tokenklaw.slash-commands.md",
      "runtime-capabilities.json",
      "runtime-notes.md",
      "startup-context.md",
      "middleware.memory-compression.md"
    ],
    "dryRun": true
  }
}
```

## Target path
- `C:\Users\hartm\.openclaw-tk-test\.hermes\tokenklaw` (all files would be written under this path)

## Files that would be written
- tokenklaw.rules.md
- tokenklaw.skill.md
- tokenklaw.prompt.md
- tokenklaw.slash-commands.md
- runtime-capabilities.json
- runtime-notes.md
- startup-context.md
- middleware.memory-compression.md

## Whether target stays inside approved runtime home
- Yes — all reported paths are under `C:\Users\hartm\.openclaw-tk-test`.

## Hermes runtime executable discovery
- No Hermes runtime executable, launcher, service, or process was detected on the system within approved locations (clean-room, Program Files, PATH).

## Conclusion
- TokenKlaw CLI can safely generate Hermes artifacts inside the clean-room.
- Hermes runtime was not found; consumption cannot be proven.

**Status:** Scaffolded — runtime not found / consumption unproven

---

Prepared by: Claude Code (execution)
