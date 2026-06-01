# Validation run: OpenClaw clean-room install — failed attempt

Timestamp: 2026-05-31T22:20:00Z (approx)

This document records the failed validation attempt to install TokenKlaw's OpenClaw runtime into an isolated clean-room. It captures exact commands, observed output, root cause, files created, and a corrected plan for the next run.

---

## Exact command executed

pwsh -File C:\Users\hartm\tokenklaw\apps\site\public\install.ps1 `
  -Dir "C:\Users\hartm\.openclaw-tk-test" `
  -Runtime openclaw `
  -NonInteractive

This is the full, verbatim command used during the run.

## What happened (stdout / stderr highlights)

- Node detected: v24.15.0
- pnpm detected: 11.1.2
- Installer attempted to clone TokenKlaw into the directory specified by -Dir but failed because the directory already existed and was not empty:
  `fatal: destination path 'C:\Users\hartm\.openclaw-tk-test' already exists and is not an empty directory.`
- pnpm reported: `[ERR_PNPM_NO_PKG_MANIFEST] No package.json found in C:\Users\hartm\.openclaw-tk-test`
- Build steps failed later due to missing workspace tooling (e.g., `tsc` not recognized) and the CLI dist was not produced.
- Final installer message: `CLI binary not found at C:\Users\hartm\.openclaw-tk-test\apps\cli\dist\index.js after build step.`
- Process exited with non-zero status (exit code 1).

(Full stdout/stderr captured separately in the run log.)

## Why it failed (root cause)

The failure was expected and caused by path confusion between two separate concepts that must remain distinct for a correct validation:

1. TokenKlaw source/clone directory (the TokenKlaw repository workspace that the installer clones or updates and builds from)
2. OpenClaw "clean runtime home" (the isolated directory where OpenClaw runtime artifacts and config should be installed and run during validation)

I pre-created the OpenClaw clean runtime home at `C:\Users\hartm\.openclaw-tk-test` and placed small test files there (rules/skills scaffolding). Then I invoked the installer with `-Dir` pointing at that same directory. The install script expects `-Dir` to be the TokenKlaw workspace (a fresh or existing tokenklaw repo clone). Because the directory was non-empty and not a TokenKlaw git workspace, `git clone` failed and the installer could not proceed to build the CLI or install runtime artifacts.

In short: the directory used for the TokenKlaw source clone and the intended OpenClaw runtime home were the same, which is incorrect.

## Files created by this attempt

Under `C:\Users\hartm\.openclaw-tk-test` the following files/directories exist (created earlier or left in place after the failed run):

- rules/test-tokenklaw-clean.rules (289 bytes)
- skills/test-tokenklaw-clean/SKILL.md (231 bytes)

No `package.json`, no `node_modules`, and crucially no `apps/cli/dist/index.js` were produced.

## Evidence collected

- Exact command (see above)
- Installer stdout/stderr showing git clone failure and missing package.json/build errors
- Recursive listing of `C:\Users\hartm\.openclaw-tk-test` showing the two small rule/skill files

## Conclusion

- The attempted run did NOT produce an OpenClaw runtime binary.
- The OpenClaw runtime never executed during this run.
- There is NO evidence that OpenClaw consumed any TokenKlaw artifacts.

Therefore, the OpenClaw integration remains in the **Scaffolded** state — consumption unproven.

---

## Corrected plan for the next validation run (separation of concerns)

We will use two distinct directories as described below. I will not perform the repair run until you confirm or request it.

A) TokenKlaw source/clone directory (where the installer clones/builds TokenKlaw):

- Path: `C:\Users\hartm\.tokenklaw-openclaw-test-src`
- Purpose: this will hold a git clone of `https://github.com/janpaul80/tokenklaw.git` and the installer will run build steps here. This is what `-Dir` should point to when invoking the install script.

B) OpenClaw clean runtime home (isolated runtime directory that must be empty / controlled before runtime install):

- Path: `C:\Users\hartm\.openclaw-tk-test`
- Purpose: this directory is the isolated runtime home where OpenClaw artifacts are installed by the CLI and where the runtime will be executed for evidence collection. It must be kept separate and must NOT be used as the TokenKlaw source clone.

Planned steps (verification mode) when you approve:

1. Create the TokenKlaw source/clone dir:
   - `C:\Users\hartm\.tokenklaw-openclaw-test-src`
2. Run installer with `-Dir` pointing to the TokenKlaw source dir, and request only runtime artifacts for OpenClaw, with the OpenClaw runtime home set to `C:\Users\hartm\.openclaw-tk-test` if the TokenKlaw CLI supports a separate runtime destination argument. If the CLI does not support a separate runtime destination, perform the install into the TokenKlaw source dir and then run the CLI command that installs the OpenClaw artifacts into the separate clean runtime home. (Implementation detail will be confirmed by inspecting the CLI help and install behavior.)
3. Capture exact commands, stdout/stderr, files created under both directories, tree listing of the clean runtime home, and whether any OpenClaw process executes and loads the TokenKlaw artifacts.
4. If OpenClaw runs and loads TokenKlaw artifacts, collect evidence (logs, process output, timestamps) that show consumption — only then mark the integration Validated.

Notes / constraints:
- I will not modify or touch `C:\Users\hartm\.openclaw` (your personal OpenClaw environment) at any point.
- All operations will be limited to the two approved directories above.

---

If you approve the corrected plan, I will prepare the TokenKlaw source clone directory and the detailed verification steps. I will also commit this results doc into the repository and push the branch (see the commit metadata below).



*End of document.*
