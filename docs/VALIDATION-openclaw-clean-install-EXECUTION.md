# OpenClaw Clean‑Room Validation Plan (Execution)

Status: Investigation → clean install validation pending
Date: 2026-05-31
Owner: Paul Hartmann / TokenKlaw

## Purpose
Provide a safe, reproducible plan to verify whether OpenClaw consumes TokenKlaw artifacts written to a user profile, **without touching the personal OpenClaw folder (C:\Users\hartm\.openclaw)**.

## Clean test path
```
C:\Users\hartm\.openclaw-tk-test
```

## High‑Level Plan
1. **Isolated Environment Setup**  
   - Create clean directory path shown above.  
   - Set environment variable `OPENCLAW_HOME` (or equivalent) to this path for all test commands.  
   - Never read or write to `C:\Users\hartm\.openclaw`.

2. **Runtime Installation / Invocation**  
   - Install or launch OpenClaw with configuration pointing to the clean test path.  
   - Example PowerShell session:  
     ```powershell
     $env:OPENCLAW_HOME = 'C:\Users\hartm\.openclaw-tk-test'
     & 'C:\Path\To\openclaw.exe' --version
     & 'C:\Path\To\openclaw.exe' skills list
     ```  
   - Capture CLI stdout/stderr and logs written under the clean path.

3. **TokenKlaw Test Artifacts**  
   Within the clean‑room only, create harmless probe files:
   - `skills\test-tokenklaw-clean\SKILL.md`
   - `rules\test-tokenklaw-clean.rules`
   Each may use the neutral placeholder text `TOKENKLAW_PROBE_SLASH_C_PLACEHOLDER` if necessary to avoid shell substitution.

4. **Expected OpenClaw Files / Directories**
   - `config.toml` or equivalent
   - `skills/`, `rules/`, `log/`, `cache/` directories

5. **Evidence Collection**
   - CLI outputs (stdout + stderr)
   - Logs from `.../log/`
   - Filesystem snapshot of `C:\Users\hartm\.openclaw-tk-test`
   - Environment summary (any created configs)

6. **Consumption Proof Criteria**
   - CLI or log references to `test-tokenklaw-clean` skill or rules file
   - Loading of user skills/rules from `...\.openclaw-tk-test`

7. **Pass / Fail Conditions**
   | Outcome | Criteria |
   |----------|-----------|
   | **PASS** | Runtime explicitly lists/loads the test skill or rules |
   | **FAIL** | No evidence of loading in CLI output or logs |

   On PASS → mark *OpenClaw = Scaffolded* (file presence + runtime consumption).
   On FAIL → remain *Investigation*.

8. **Cleanup / Rollback**
   - Optional: remove the clean test path if requested
   - Confirm no system/global changes.

9. **Reporting**
   - Save results and evidence under `docs/evidence/openclaw-cleanroom-<timestamp>/`.
   - Write summary to `docs/VALIDATION-openclaw-clean-install-RESULTS-<timestamp>.md`.
   - Commit + push to repo.

## Guardrails
- No destructive actions outside `C:\Users\hartm\.openclaw-tk-test`
- Never modify `C:\Users\hartm\.openclaw`
- Stop for approval if elevation or system change becomes necessary
- All steps occur under a non‑interactive isolated test environment

Co‑Authored‑By: Claude Opus 4.8 <noreply@anthropic.com>