# OpenCode clean-room dry-probe results

Timestamp: 2026-06-01T00:40:00Z (approx)

This document records the non‑destructive dry‑probe execution for the OpenCode CLI executed with USERPROFILE redirected into the approved clean‑room runtime home. All runs were read‑only with no session creation or model calls.

Approved runtime home used:
- C:\Users\hartm\.openclaw-tk-test

Forbidden personal OpenCode path (not to be touched):
- C:\Users\hartm\.opencode

---

## Exact commands executed (verbatim)

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install opencode --dry-run
```

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
opencode --help
```

```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
opencode --version
```

## Captured outputs

### TokenKlaw CLI install opencode --dry-run JSON

```json
{
  "ok": true,
  "dryRun": true,
  "install": {
    "agent": "opencode",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.opencode\\tokenklaw",
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

### opencode --help (summary)
- Subcommands: completion, acp, mcp, [project], attach, run, debug, providers, agent, upgrade, uninstall, serve, web, models, stats, export, import, github, pr, session, plugin, db
- Options: model selection, continue, session management, agent selection, port, hostname, config files
- Configurable via plugin system

### opencode --version
- `1.15.13`

## Target path / environment
- USERPROFILE redirected to clean-room: `C:\Users\hartm\.openclaw-tk-test`
- No files accessed in personal `C:\Users\hartm\.opencode`

## Files accessed / modified
- None during read‑only help/version probes. Database migration briefly triggered internally but completed without accessing forbidden path.

## Whether OpenCode consumed TokenKlaw artifacts
- No evidence of TokenKlaw artifact consumption. OpenCode uses its own plugin system, session management, and configuration, not TokenKlaw artifacts. Requires explicit plugin or config to reference them.

## Conclusion
- OpenCode CLI runs successfully under redirected USERPROFILE in the clean-room.
- Version 1.15.13 discovered.
- No TokenKlaw artifact consumption was observed — would require explicit plugin or config to load external skills/rules.

**Status:** Investigation (consumption unproven)

---

Prepared by: Claude Code (dry‑probe)