# OpenClaw CLI dry-run probe — results

Timestamp: 2026-05-31T23:50:00Z (approx)

This document records the environment‑override dry‑run probes executed to determine whether the TokenKlaw CLI can redirect its default OpenClaw install target into the approved clean‑room runtime home.

Approved runtime target (approved for install):
- `C:\Users\hartm\.openclaw-tk-test\.openclaw\tokenklaw`

Forbidden personal path (not to be touched):
- `C:\Users\hartm\.openclaw`

---

1) Commands executed (verbatim)

- Baseline dry-run (no env overrides):
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

- HOME override:
  $env:HOME = 'C:\Users\hartm\.openclaw-tk-test'
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

- USERPROFILE override:
  $env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

- XDG_CONFIG_HOME override:
  $env:XDG_CONFIG_HOME = 'C:\Users\hartm\.openclaw-tk-test\xdg'
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

2) JSON outputs (highlights)

- Baseline: default dir reported as `C:\Users\hartm\\.openclaw\\tokenklaw` (CLI default)

- HOME override: still reported default `C:\Users\hartm\\.openclaw\\tokenklaw` (no change)

- USERPROFILE override: reported dir changed to `C:\Users\hartm\\.openclaw-tk-test\\.openclaw\\tokenklaw` — SUCCESS

- XDG_CONFIG_HOME override: reported default `C:\Users\hartm\\.openclaw\\tokenklaw` (no change)

Full JSON outputs were captured in the command logs (stdout) and are included as separate evidence files in the run logs.

3) Conclusion

- The TokenKlaw CLI honors `USERPROFILE` for resolving its default runtime install location. Setting `USERPROFILE` to the approved runtime home will redirect the install target into the clean‑room.
- `HOME` and `XDG_CONFIG_HOME` are not honored by the CLI for this purpose.

---

Next recommended safe command (real install, with USERPROFILE override):

$env:USERPROFILE = 'C:\Users\hartm\.openclaw-tk-test'
node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw

This will write into `C:\Users\hartm\.openclaw-tk-test\.openclaw\tokenklaw` and will not touch the forbidden `C:\Users\hartm\.openclaw` path.

---

Prepared by: Claude Code (execution)

