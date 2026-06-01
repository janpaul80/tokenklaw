# OpenClaw clean-room — Build & CLI inspection results

Timestamp: 2026-05-31T22:30:00Z (approx)

This document records the build and CLI inspection phase of the OpenClaw clean-room validation. No runtime install was performed. All actions were limited to the approved TokenKlaw source workspace and the approved OpenClaw runtime home.

Approved paths used in this phase
- TokenKlaw source/clone directory: C:\Users\hartm\.tokenklaw-openclaw-test-src
- OpenClaw clean runtime home: C:\Users\hartm\.openclaw-tk-test

Forbidden path (never touched): C:\Users\hartm\.openclaw

---

1) Exact commands executed (verbatim)

- Create directories (earlier):
  New-Item -ItemType Directory -Force -Path 'C:\Users\hartm\.tokenklaw-openclaw-test-src'
  New-Item -ItemType Directory -Force -Path 'C:\Users\hartm\.openclaw-tk-test'

- Clone TokenKlaw (earlier):
  git clone https://github.com/janpaul80/tokenklaw.git "C:\Users\hartm\.tokenklaw-openclaw-test-src"

- Build workspace (run installer in build-only mode):
  pwsh -File C:\Users\hartm\tokenklaw\apps\site\public\install.ps1 `
    -Dir "C:\Users\hartm\.tokenklaw-openclaw-test-src" `
    -Runtime "" `
    -NonInteractive

- Confirm CLI binary exists (listing):
  Get-ChildItem -Path 'C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist' -Recurse -Force

- Run CLI help to verify runnable:
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" --help

- Probe install dry-run (non-destructive probe):
  node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

---

2) Captured stdout / stderr (highlights)

- Installer build output (high-level):
  - Node detected: v24.15.0
  - pnpm detected: 11.1.2
  - Existing TokenKlaw repo found at: C:\Users\hartm\.tokenklaw-openclaw-test-src
  - Installing dependencies... (pnpm completed)
  - Building workspace... (Next.js + tsc builds completed)
  - [TokenKlaw] Running doctor... (doctor output)
  - [TokenKlaw] Skipping runtime install.
  - [TokenKlaw] Installation complete.
  - [TokenKlaw] Run: node C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js --help

- CLI help (stdout):
  tokenklaw <command> [options]
  Commands:
    doctor
    run "<prompt>" [--context "<ctx>"] [--provider <id>] [--no-cache]
    inspect [--limit N]
    stats [--since <ms>] [--until <ms>]
    proxy [--host <host>] [--port <port>]
    install <runtime|all> [--dry-run]
    activate <on|off|stats>

- CLI install dry-run (JSON output, stdout):
  {
    "ok": true,
    "dryRun": true,
    "install": {
      "agent": "openclaw",
      "dir": "C:\\Users\\hartm\\.openclaw\\tokenklaw",
      "written": [
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\tokenklaw.rules.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\tokenklaw.skill.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\tokenklaw.prompt.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\tokenklaw.slash-commands.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\runtime-capabilities.json",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\runtime-notes.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\SOUL.md",
        "C:\\Users\\hartm\\.openclaw\\tokenklaw\\middleware.token-compression.md"
      ],
      "dryRun": true
    }
  }

- No stderr errors of concern during build; build completed successfully.

---

3) Build result

- Result: SUCCESS (workspace built; installer completed with runtime install skipped)
- Exit status: installer completed normally

---

4) Generated files (not exhaustive — highlights)

In TokenKlaw source workspace (after build):
- C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js (8,019 bytes)
- C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js.map
- Various adapter files under apps\cli\dist\adapters\ (claude.js, codex.js, roo.js, etc.)
- apps/site build output (Next.js static pages) in the source workspace (not copied to runtime home)

In OpenClaw runtime home (approved runtime dir) — unchanged by this phase:
- C:\Users\hartm\.openclaw-tk-test\ (empty or previously present test scaffolding; not modified by the build)

---

5) CLI runnable

- Confirmed: `node C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js --help` ran successfully and printed help commands.

---

6) Important safety finding (critical)

- The CLI's default runtime install target (as reported by `--dry-run`) is:
  `C:\Users\hartm\.openclaw\tokenklaw`

- This means that running the CLI install without additional flags will write into `C:\Users\hartm\.openclaw`, which is explicitly forbidden by the validation rules. The CLI's `install` command accepts `--dry-run` but **does not** expose a `--dest` / `--dir` flag in its documented help output.

- Therefore, performing a real `install openclaw` now would attempt to write into the forbidden path. We must NOT run the real install unless we can redirect the install output to the approved runtime home (`C:\Users\hartm\.openclaw-tk-test`).

---

7) Recommended next actions (options)

A) Safe redirect via environment override (preferred probe):
   - Attempt a dry-run with environment variables that change the perceived user home so the CLI computes the runtime dir under the approved runtime home.
   - Example (PowerShell):
     $env:USERPROFILE = 'C:\Users\hartm'  # current; to redirect, set to 'C:\Users\hartm\.openclaw-tk-test'?
     # Better: set an env var the CLI respects (if any). We need to discover which env var the CLI uses (HOME, USERPROFILE, XDG_CONFIG_HOME, OPENCLAW_HOME). Probe with dry-run while setting likely env vars to the runtime home.

   - Planned safe probe (no writes outside approved dirs):
     # dry-run with HOME override
     $env:HOME = 'C:\Users\hartm\.openclaw-tk-test'; node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

   - If the CLI honors HOME/USERPROFILE/XDG_CONFIG_HOME for its default `~/.openclaw` location, this will show `dir` pointing to the approved runtime home and `written` pointing inside it. This is a non-destructive dry-run and acceptable to run.

B) If env overrides are not effective:
   - Request a small CLI enhancement (flag) or adjust the installer before running real install. This requires a code change in TokenKlaw; we would not make that change without your approval.

C) As an interim approach (if allowed):
   - Allow the installer to write into the default path, then immediately copy the runtime artifacts into the approved runtime home, and delete the temporary write. This is **NOT allowed** under current constraints because it touches the forbidden path.

---

8) Conclusion

- Build and CLI inspection successful.
- CLI exists and is runnable at: C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js
- The CLI's install behavior defaults to writing into the forbidden path `C:\Users\hartm\.openclaw`.
- We will NOT perform the runtime install until we can ensure the CLI writes only to the approved runtime home `C:\Users\hartm\.openclaw-tk-test`.

---

Evidence files to commit (this document plus captured logs):
- docs/VALIDATION-openclaw-clean-install-BUILD-RESULTS-20260531-223000.md (this file)
- Captured stdout/stderr logs from the installer run (attached separately in the run log)
- Listing output showing apps/cli/dist contents
- Dry-run JSON stdout from `install openclaw --dry-run`

---

Prepared by: Claude Code (execution phase)

Next: await your explicit approval to run safe dry-run probes with environment overrides to ensure the installer will target `C:\Users\hartm\.openclaw-tk-test`, or instruct me to proceed differently.
