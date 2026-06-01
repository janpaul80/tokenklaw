# Corrected Verification Plan — OpenClaw Clean-Room Validation

Timestamp (draft): 2026-05-31T22:30:00Z

This plan separates the TokenKlaw source/clone workspace from the OpenClaw clean runtime home and documents exact commands, safety guardrails, pass/fail criteria, rollback, and evidence to collect. This document is a plan only — no destructive or runtime actions will be executed until you explicitly approve.

## Directory model (explicit — do not confuse)

1) TokenKlaw source / clone directory (TokenKlaw workspace)

- Path (exact): C:\Users\hartm\.tokenklaw-openclaw-test-src
- Purpose: host a git clone of the TokenKlaw repository, run pnpm install and the workspace build there, and produce the CLI binary at `apps/cli/dist/index.js`.
- MUST be used as the -Dir argument to TokenKlaw's installer. It must not be used as the OpenClaw runtime home.

2) OpenClaw clean runtime home (isolated runtime directory)

- Path (exact): C:\Users\hartm\.openclaw-tk-test
- Purpose: contain only OpenClaw runtime files and any TokenKlaw OpenClaw artifacts the CLI installs for runtime consumption (skills, rules, runtime config). This directory is the only location where the OpenClaw runtime will be launched for validation.
- MUST NOT be used as the TokenKlaw source clone directory.

Do NOT touch: C:\Users\hartm\.openclaw (user personal OpenClaw environment)

---

## High-level steps (verification mode — no repair)

1. Create the two directories (if not already present):
   - TokenKlaw source: `C:\Users\hartm\.tokenklaw-openclaw-test-src` (empty)
   - OpenClaw runtime home: `C:\Users\hartm\.openclaw-tk-test` (empty or controlled)

2. Clone TokenKlaw into the TokenKlaw source dir (exact):
   - Command (exact):
     git clone https://github.com/janpaul80/tokenklaw.git "C:\Users\hartm\.tokenklaw-openclaw-test-src"

3. Inspect CLI help & runtime install options (do not run install yet):
   - Build or locate the CLI dist first if necessary (see step 4 below).
   - Check CLI help for runtime destination flags:
     - Command (exact):
       node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" --help
     - And specifically:
       node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install --help
   - We will use any documented `--dest`, `--dir`, or `--target` option to point runtime artifacts to `C:\Users\hartm\.openclaw-tk-test`. If no such option exists, the plan includes a non-destructive probe to determine where the CLI writes runtime artifacts before moving them into the runtime home.

4. Install/build TokenKlaw workspace (but do not run runtime):
   - Commands (exact sequence planned):
     pwsh -File "C:\Users\hartm\tokenklaw\apps\site\public\install.ps1" `
       -Dir "C:\Users\hartm\.tokenklaw-openclaw-test-src" `
       -Runtime "" `
       -NonInteractive

   - Notes: we pass empty `-Runtime` to have the installer clone and build the workspace but skip any runtime agent install. This produces the CLI binary at `apps/cli/dist/index.js` (expected). If installer requires `-SkipBuild` or other switches, we will adapt per installer help output — but only after reading help and confirming.

5. Verify CLI binary existence and inspect install options.
   - Expected file after build:
     - `C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js`
   - If missing, capture stdout/stderr and fail the verification run (do not attempt repair).

6. Prepare the OpenClaw runtime home (ensure empty and controlled):
   - Ensure `C:\Users\hartm\.openclaw-tk-test` is empty except for files we will intentionally place there. If pre-existing test scaffolding exists, list and capture it in the verification evidence.

7. Non-destructive probe to discover CLI runtime destination (if CLI lacks `--dest`):
   - Run CLI in dry-run or `--help` to find flags. If none, run the CLI install command while capturing filesystem writes and restricting observable targets to the two approved directories only. Example (planned — probe only, not destructive):
     node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dry-run

   - If `--dry-run` not available, run the install with verbose logging while monitoring writes under the two approved paths and the TokenKlaw source dir. We will NOT allow the installer to write outside these two paths — if it attempts to, the run will be aborted and reported.

8. Install OpenClaw runtime artifacts into the OpenClaw runtime home:
   - Preferred (if supported by CLI):
     node "C:\Users\hartm\.tokenklaw-openclaw-test-src\apps\cli\dist\index.js" install openclaw --dest "C:\Users\hartm\.openclaw-tk-test" --non-interactive

   - Fallback (if no dest flag): run the CLI install and then copy/move only the runtime artifacts from the CLI-chosen output location into `C:\Users\hartm\.openclaw-tk-test`. All moves or copies will be performed only within the two approved paths.

9. Launch/execute OpenClaw from the clean runtime home to prove consumption (only after artifacts placed):
   - Command (example):
     "C:\Users\hartm\.openclaw-tk-test\openclaw.exe" --config "C:\Users\hartm\.openclaw-tk-test\config.yaml"

   - Alternative: if OpenClaw is a node/script runtime, run the documented start command from the runtime home.

   - Capture stdout, stderr, created logs, process list, and evidence that TokenKlaw artifacts (skills/rules) were loaded (e.g., log lines like "Loaded skill: ..." or errors referencing the artifacts).

10. Evidence collection (everything captured verbatim):
    - Exact command(s) run (copied verbatim)
    - Stdout and stderr logs (timestamped)
    - Full recursive tree listing of:
      - TokenKlaw source dir: `C:\Users\hartm\.tokenklaw-openclaw-test-src`
      - OpenClaw runtime home: `C:\Users\hartm\.openclaw-tk-test`
    - Timestamps of file writes
    - Any generated artifacts: binaries, config, rule/skill files
    - If OpenClaw ran: process output showing loading of TokenKlaw artifacts, or explicit artifact-consumption log lines

---

## Expected files (post-success)

TokenKlaw source dir (`C:\Users\hartm\.tokenklaw-openclaw-test-src`):
- package.json (repo root)
- apps/cli/dist/index.js (CLI binary)
- node_modules/ (populated)
- other workspace packages produced by build

OpenClaw runtime home (`C:\Users\hartm\.openclaw-tk-test`):
- OpenClaw runtime binary or start scripts (openclaw.exe or start script)
- TokenKlaw OpenClaw artifacts (e.g., skills/, rules/, config files)
- runtime logs (stdout/stderr or log files)

---

## Safety guardrails

- No operations will be performed outside these two approved paths: `C:\Users\hartm\.tokenklaw-openclaw-test-src` and `C:\Users\hartm\.openclaw-tk-test`.
- Specifically, `C:\Users\hartm\.openclaw` is off-limits and will never be read, written, or touched.
- No destructive delete or cleanup will run outside the two approved paths.
- All destructive commands (Remove-Item -Recurse -Force) require explicit approval before execution.
- If an operation would write outside the approved directories, the run will abort and capture evidence of the attempt.
- If the TokenKlaw installer attempts to clone into a non-empty directory, the run will stop and report (no overwrite).

---

## Pass / Fail criteria

Pass (integration Validated):
- The OpenClaw runtime binary exists in `C:\Users\hartm\.openclaw-tk-test` and was started successfully from that directory, AND
- OpenClaw runtime logs contain clear evidence that TokenKlaw-provided artifacts were loaded/consumed (for example, concrete log lines naming the skills/rules or confirming registration), AND
- All evidence files (stdout/stderr, directory trees, timestamps) were collected and captured.

Fail (remains Scaffolded):
- OpenClaw runtime does not start from the runtime home, OR
- OpenClaw starts but shows no evidence of loading TokenKlaw artifacts, OR
- Only TokenKlaw artifacts were copied into the runtime home but OpenClaw never executed them.

In any failure case we will stop, capture evidence, and discuss next steps.

---

## Rollback / cleanup plan (non-destructive by default)

- To rollback all created test artifacts (only inside the two approved directories) the following commands will be used if you approve cleanup:

  Remove-Item -Recurse -Force "C:\Users\hartm\.tokenklaw-openclaw-test-src"
  Remove-Item -Recurse -Force "C:\Users\hartm\.openclaw-tk-test"

- These commands will only be run after explicit approval and only affect the two approved paths.

---

## What would prove consumption (concrete examples)

- Log lines printed by OpenClaw during startup such as:
  - "Loaded TokenKlaw skill: <skill-name> from C:\Users\hartm\.openclaw-tk-test\skills\..."
  - "Registered TokenKlaw rule: <rule-name>"
  - HTTP API responses or CLI output indicating TokenKlaw artifacts are active (e.g., an OpenClaw endpoint returns data generated by a TokenKlaw skill)
- A running OpenClaw process with commandline rooted in `C:\Users\hartm\.openclaw-tk-test` and evidence (timestamps) matching artifact install times.
- If OpenClaw exposes a "list loaded skills" command, its output explicitly contains the TokenKlaw artifacts.

---

## Next actions (after you approve the plan)

1. Create the TokenKlaw source dir: `C:\Users\hartm\.tokenklaw-openclaw-test-src` and the OpenClaw runtime home: `C:\Users\hartm\.openclaw-tk-test` (empty).
2. Execute the non-destructive build and probe steps (steps 2–5 above) to validate the CLI build and install options.
3. If the CLI supports targeted install into the runtime home, run the install and then launch OpenClaw from the runtime home to collect evidence. If not, follow the controlled fallback described above.

No repair actions (rebuilds, forced clones, deletes) will be performed until you explicitly approve them.

---

Prepared by: Claude Code (planning mode) — awaiting your approval to execute the verified plan.
