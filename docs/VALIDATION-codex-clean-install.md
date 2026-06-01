# Codex Clean-Room Validation Plan

Status: Investigation → clean install validation pending (do not use personal Codex profile)
Date: 2026-05-31
Owner: Paul Hartmann / TokenKlaw

## Objective
Prove whether Codex actually consumes user-scoped skills and rules from:
- %USERPROFILE%\.codex\skills\<name>\
- %USERPROFILE%\.codex\rules\<name>.rules

without relying on the personal Codex profile. All testing must be performed in an isolated test environment.

## Constraints
- Do NOT touch C:\Users\hartm\.codex for testing.
- Use a dedicated test profile, e.g. C:\Users\hartm\.codex-tk-test, by exporting CODEX_HOME prior to invocation.
- Only create harmless probes (no external calls, no privileged actions).
- Record exact commands, outputs, and file paths.

## Environment Setup (Windows, PowerShell)
1) Create isolated home
- CODEX_HOME: C:\Users\hartm\.codex-tk-test
- Structure to create:
  - %CODEX_HOME%\skills\test-tokenklaw-clean\SKILL.md
  - %CODEX_HOME%\rules\test-tokenklaw-clean.rules

2) Test artifacts (harmless)
- SKILL.md content includes a unique Probe ID: `test-skill-probe-clean-20260531`
- Rules file includes a unique Probe ID: `test-rules-probe-clean-20260531`

3) Do not install anything globally. Only write within CODEX_HOME.

## Verification Methods

A) CLI discovery (preferred if supported by Codex build)
- With CODEX_HOME set to the test profile, run:
  - codex --version
  - codex skills list (or equivalent)  
  - codex skills (or equivalent)  
- Evidence: output lists `test-tokenklaw-clean` or mentions the skill directory under %CODEX_HOME%\skills.

B) Log-based evidence
- After a Codex invocation with CODEX_HOME pointing to the test folder, check:
  - %CODEX_HOME%\log\* (or runtime logs under the profile)
  - Search for `skills`, `rules`, or the probe IDs
- Evidence: log entries referencing `test-tokenklaw-clean` or loading skills from %CODEX_HOME%\skills.

C) Rules consumption (best-effort)
- If Codex exposes a rules diagnostics command, run it under the test CODEX_HOME.
- Otherwise, rely on log messages indicating `.rules` loading from the test profile.

D) Negative control
- Move/rename the test skill directory and re-run the same commands. The absence of the skill from listings/logs strengthens evidence that Codex was previously reading the test path.

## Success Criteria (Consumption Proven)
- At least one of the following is captured under the test profile:
  1. CLI output includes the test skill name or path
  2. Logs explicitly mention reading the test skill directory
  3. Logs show `.rules` file from the test profile being parsed

If any of these are true, mark Codex as "Scaffolded → Consumption proven" for runtime loading of skills/rules (not TokenKlaw functionality, just Codex path consumption). Otherwise, remain at Investigation.

## Commands (PowerShell snippets)

- Create CODEX_HOME and artifacts
```
$env:CODEX_HOME = "$env:USERPROFILE\.codex-tk-test"
New-Item -ItemType Directory -Path $env:CODEX_HOME -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $env:CODEX_HOME 'skills\test-tokenklaw-clean') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $env:CODEX_HOME 'rules') -Force | Out-Null
Set-Content -Path (Join-Path $env:CODEX_HOME 'skills\test-tokenklaw-clean\SKILL.md') -Encoding UTF8 -Value @'
---
name: "test-tokenklaw-clean"
description: "Clean-room TokenKlaw probe. Verifies Codex skills loader in isolated CODEX_HOME."
---
Probe ID: test-skill-probe-clean-20260531
'@
Set-Content -Path (Join-Path $env:CODEX_HOME 'rules\test-tokenklaw-clean.rules') -Encoding UTF8 -Value @'
# test-tokenklaw rules probe (clean-room)
# id: test-rules-probe-clean-20260531
prefix_rule(pattern=["C:\\WINDOWS\\System32\\cmd.exe", "/c", "echo", "codex-clean-rules-probe"], decision="allow")
'@
```

- Invoke Codex CLI (best-effort; tool must exist on PATH or known location)
```
# Prefer explicit path if known; otherwise Get-Command codex
$codex = (Get-Command codex -ErrorAction SilentlyContinue).Source
& $codex --version
& $codex skills list
& $codex skills
```

- Log verification
```
$log = Join-Path $env:CODEX_HOME 'log'
if (Test-Path $log) {
  Get-ChildItem -Recurse $log | Select-Object -First 20 FullName
  Select-String -Path (Join-Path $log '*') -Pattern 'test-tokenklaw-clean|skills|rules' -SimpleMatch | Select-Object -First 40
}
```

- Negative control
```
Rename-Item -Path (Join-Path $env:CODEX_HOME 'skills\test-tokenklaw-clean') -NewName 'skills\test-tokenklaw-clean.disabled'
& $codex skills list
```

## Reporting Template
- CODEX_HOME used: C:\Users\hartm\.codex-tk-test
- CLI present: yes/no; path: <exe>
- Skill listing shows test skill: yes/no; snippet
- Logs mention loading test skill/rules: yes/no; snippet
- Negative control removes it from listing/logs: yes/no
- Conclusion: Consumption proven or not proven

## Guardrails
- Never run Codex with CODEX_HOME pointing to C:\Users\hartm\.codex for validation.
- Delete test artifacts from the test profile after the run unless asked to keep them.
- No writes to production TokenKlaw installers until consumption is proven.

## Next Step After Proof
- If consumption is proven, update Codex to "Scaffolded" and proceed to design the TokenKlaw installer to target:
  - %USERPROFILE%\.codex\skills\tokenklaw\
  - %USERPROFILE%\.codex\rules\tokenklaw.rules
- If not proven, remain at Investigation and revisit assumptions.
