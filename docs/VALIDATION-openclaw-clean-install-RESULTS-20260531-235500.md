# OpenClaw clean-room install results — isolated install verified

Timestamp: 2026-05-31T23:55:00Z (approx)

This document records the verified results of the actual install step performed in the clean-room environment for OpenClaw, following successful build and dry-run verification phases.

---

## Approved paths
- TokenKlaw source/clone directory: `C:\Users\hartm\.tokenklaw-openclaw-test-src`
- OpenClaw runtime home: `C:\Users\hartm\.openclaw-tk-test`
- Forbidden personal environment (untouched): `C:\Users\hartm\.openclaw`

---

## Command executed (real install)
```powershell
$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw
```

## CLI JSON output
```json
{
  "ok": true,
  "dryRun": false,
  "install": {
    "agent": "openclaw",
    "dir": "C:\\Users\\hartm\\.openclaw-tk-test\\.openclaw\\tokenklaw",
    "written": [
      "tokenklaw.rules.md",
      "tokenklaw.skill.md",
      "tokenklaw.prompt.md",
      "tokenklaw.slash-commands.md",
      "runtime-capabilities.json",
      "runtime-notes.md",
      "SOUL.md",
      "middleware.token-compression.md"
    ]
  }
}
```

---

## Files created

Under approved runtime home:
```
C:\Users\hartm\.openclaw-tk-test\.openclaw\tokenklaw\
├── tokenklaw.rules.md
├── tokenklaw.skill.md
├── tokenklaw.prompt.md
├── tokenklaw.slash-commands.md
├── runtime-capabilities.json
├── runtime-notes.md
├── SOUL.md
└── middleware.token-compression.md
```

Pre-existing clean test scaffolding (unchanged):
```
C:\Users\hartm\.openclaw-tk-test\rules\test-tokenklaw-clean.rules
C:\Users\hartm\.openclaw-tk-test\skills\test-tokenklaw-clean\SKILL.md
```

No files were modified or created under `C:\Users\hartm\.openclaw`.

---

## Results
- ✅ Install succeeded.
- ✅ All expected TokenKlaw OpenClaw artifacts were generated within the approved clean-room directory tree.
- ✅ No external or forbidden directories were touched.
- ✅ Every file path in the install JSON matches the clean-room HOME environment redirection.
- ⚠️ No OpenClaw runtime execution occurred yet — only artifact installation.

---

## Current status
**OpenClaw integration status: Scaffolded / isolated install verified**

Reasoning:
- TokenKlaw successfully produced OpenClaw artifacts to the clean-room runtime home.
- No evidence yet that a running OpenClaw runtime has consumed these artifacts.

---

## Next phase: Runtime consumption validation

Goal: prove that a real OpenClaw runtime loads or reacts to TokenKlaw artifacts.

### Approved approach
1. Locate the OpenClaw runtime executable or launcher.
2. Run it with USERPROFILE directed to the approved clean-room runtime home:
   ```powershell
   $env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
   & 'C:\path\to\openclaw.exe'  # or the equivalent runtime invocation
   ```
3. Capture evidence of consumption such as:
   - Log lines referencing TokenKlaw skills/rules.
   - Loaded file names like `SOUL.md` or `runtime-capabilities.json`.
   - Behavioral indication that TokenKlaw middleware is active.
   - Output or API responses showing TokenKlaw features.

### Consumption proof criteria
- **Logs mention TokenKlaw files or paths.**
- **OpenClaw lists or activates TokenKlaw artifacts.**
- **OpenClaw reports or behaves according to TokenKlaw middleware or SOUL logic.**

If no runtime executable is available or no logs/evidence indicate loading, the system remains Scaffolded.

---

Prepared by: Claude Code (execution phase)

Next step: locate and, if available, execute an OpenClaw runtime under the clean-room home to verify actual artifact consumption.
