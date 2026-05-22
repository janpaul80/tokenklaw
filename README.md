<p align="center">
  <img src="https://raw.githubusercontent.com/janpaul80/tokenklaw/main/apps/site/public/tokenklaw-logo.png" alt="TokenKlaw logo" width="220" />
</p>

# TokenKlaw

TokenKlaw is a production-first activation and token-optimization layer for AI coding agents and workspaces.

It gives coding-agent runtimes a consistent way to activate token-saving behavior, suppress noisy output, reduce repeated context, and surface clear runtime state. The current hardened integration is focused on Claude Code, with scaffolds for additional runtimes such as Codex CLI, Roo Code, Cursor, Cline, Continue, Gemini, OpenClaw, Hermes, Windsurf, OpenCode, aider, and OpenDevin-style environments.

Website: [token.klaw.at](https://token.klaw.at)  
Repository: [github.com/janpaul80/tokenklaw](https://github.com/janpaul80/tokenklaw)  
Created by Paul Hartmann ([@janpaul80](https://github.com/janpaul80))

## Current Production Status

Claude Code activation has been validated in the real runtime, not only in local builds.

Confirmed Claude Code behavior:

- `/tokenklaw` activates TokenKlaw.
- `/tk` is an alias for `/tokenklaw`.
- `/tokenklaw-help` displays the command table.
- `/tokenklaw-off` deactivates TokenKlaw.
- `/tokenklaw-stats` reports active/inactive state and statusline state.
- Active sessions show `[TOKENKLAW]` in the Claude Code statusline.
- Core demo commands are intercepted by a `UserPromptExpansion` hook before model expansion, which keeps activation output deterministic and final-output-only.
- Legacy `.toml` Claude command files are removed during install and replaced with Claude-native Markdown command files.

Expected activation output:

```text
TokenKlaw active.
Context reduction: on
Duplicate detection: on
Cache guidance: on
Verbose replies: reduced
Token-saving mode: enabled
```

Expected visible runtime badge when active:

```text
[TOKENKLAW]
```

## What TokenKlaw Does

TokenKlaw is designed to sit beside AI coding agents as a runtime activation and optimization layer.

Core responsibilities:

- Runtime activation: provides reliable commands for turning token-saving behavior on and off.
- Context discipline: encourages concise, high-signal answers while preserving technical correctness.
- Duplicate suppression: reduces repeated prompt, log, and stack-trace expansion.
- Cache guidance: tracks repeated requests and exposes cache-oriented behavior through CLI/runtime surfaces.
- Status visibility: shows a clear active-state badge so users can trust the runtime is actually enabled.
- Cross-agent scaffolding: generates runtime-specific artifacts for multiple coding-agent environments.

## One-Line Install

### macOS, Linux, and WSL

```bash
curl -fsSL https://token.klaw.at/install.sh | bash
```

GitHub raw fallback:

```bash
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash
```

Install for Claude Code directly:

```bash
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash -s -- --runtime claude
```

### Windows PowerShell

```powershell
irm https://token.klaw.at/install.ps1 | iex
```

GitHub raw fallback:

```powershell
irm https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.ps1 | iex
```

If running from a cloned repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -Runtime claude
```

## Install From Source

### Requirements

- Node.js 20 LTS or 22 LTS recommended.
- `pnpm` via Corepack.
- Git.
- Windows users may need Visual Studio Build Tools if native dependencies are rebuilt.

> Node 24 can be problematic on Windows when native packages need to compile from source. Use Node 20 or 22 LTS for the most predictable install path.

### Clone, install, and build

```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor
```

## Install Into a Runtime

Install into Claude Code:

```bash
tokenklaw install claude
```

Install into all supported/scaffolded runtimes:

```bash
tokenklaw install all
```

Preview what would be written without touching runtime files:

```bash
tokenklaw install claude --dry-run
tokenklaw install all --dry-run
```

## Claude Code Runtime Integration

TokenKlaw writes the following Claude Code artifacts:

```text
~/.claude/.claude-plugin/plugin.json
~/.claude/.claude-plugin/marketplace.json
~/.claude/commands/tokenklaw.md
~/.claude/commands/tk.md
~/.claude/commands/tokenklaw-help.md
~/.claude/commands/tokenklaw-off.md
~/.claude/commands/tokenklaw-stats.md
~/.claude/skills/tokenklaw/SKILL.md
~/.claude/hooks/hooks.json
~/.claude/hooks/tokenklaw.pre-response.cjs
~/.claude/hooks/tokenklaw-statusline.ps1
~/.claude/hooks/tokenklaw.pre-response.md
~/.claude/settings.json
~/.claude/CLAUDE.md
~/.claude/tokenklaw/*
```

The install flow is conservative around existing user configuration:

- TokenKlaw adds its `UserPromptExpansion` hook without removing unrelated hooks.
- TokenKlaw only writes a `statusLine` command when no statusline exists or when the existing statusline already belongs to TokenKlaw.
- TokenKlaw keeps its active/inactive state in `~/.claude/tokenklaw/activation-state.json`.
- The generated statusline script reads state and prints `[TOKENKLAW]` only when active.

## Runtime Commands

Inside Claude Code:

```text
/tokenklaw
/tk
/tokenklaw-help
/tokenklaw-off
/tokenklaw-stats
```

Command behavior:

| Command | Behavior |
| --- | --- |
| `/tokenklaw` | Activates TokenKlaw and writes active state. |
| `/tk` | Alias for `/tokenklaw`. |
| `/tokenklaw-help` | Shows the command table. |
| `/tokenklaw-off` | Deactivates TokenKlaw and clears the statusline badge. |
| `/tokenklaw-stats` | Shows active/inactive state, response settings, and statusline state. |

CLI-side controls are also available:

```bash
tokenklaw activate on
tokenklaw activate stats
tokenklaw activate off
```

## CLI Commands

```bash
tokenklaw doctor
tokenklaw install claude
tokenklaw install all
tokenklaw activate on
tokenklaw activate stats
tokenklaw activate off
tokenklaw run "explain this repo architecture"
tokenklaw inspect --limit 5
tokenklaw stats
```

## Runtime Support Matrix

| Runtime | Status | Notes |
| --- | --- | --- |
| Claude Code | Working | Validated command activation, hook interception, state file, and `[TOKENKLAW]` statusline. |
| Codex CLI | Experimental | Generates TokenKlaw activation artifacts and capability notes. |
| Roo Code | Experimental | Generates skill/prompt/rules scaffolding. |
| Cursor | Experimental | Generates prompt-injection style scaffolding. |
| Cline | Experimental | Generates activation scaffolding. |
| Continue | Experimental | Generates config-oriented activation notes. |
| Gemini / Antigravity | Experimental | Generates prompt/context scaffolding. |
| OpenClaw | Experimental | Includes SOUL/context compression and middleware notes. |
| Hermes | Experimental | Includes startup context and memory compression notes. |
| Windsurf | Scaffold | Future runtime target. |
| OpenCode | Scaffold | Future runtime target. |
| aider | Scaffold | Future runtime target. |
| OpenDevin | Scaffold | Future runtime target. |

## Verification

Core local checks:

```bash
pnpm --filter @tokenklaw/core build
pnpm --filter @tokenklaw/cli build
node scripts/verify-claude-activation-runtime.cjs
```

Site build:

```bash
pnpm --filter site build
```

Claude plugin validation:

```bash
claude plugin validate %USERPROFILE%\.claude --strict
```

## Troubleshooting

### Logo is broken on GitHub

The README uses a repository-relative image path:

```text
apps/site/public/tokenklaw-logo.png
```

This avoids depending on an external image host. If the image does not appear on GitHub, confirm the file is committed and pushed to the `main` branch.

### Claude commands do not appear

Run:

```bash
tokenklaw install claude
claude plugin validate %USERPROFILE%\.claude --strict
```

Then restart Claude Code.

### `[TOKENKLAW]` does not appear

Run `/tokenklaw` first. The badge appears only when the activation state file has `enabled: true`.

The state file is:

```text
~/.claude/tokenklaw/activation-state.json
```

### Windows native dependency build errors

Use Node 20 or 22 LTS and install Visual Studio Build Tools with Desktop development with C++.

## Roadmap

- Harden Claude Code demo and recording behavior.
- Expand real-runtime validation for Cursor, Roo Code, Cline, Continue, Gemini, OpenClaw, and Hermes.
- Publish a production npm package.
- Add provider-level token accounting and cache-hit reporting.
- Add repeatable integration tests for runtime installers.

## License

MIT (c) Paul Hartmann ([@janpaul80](https://github.com/janpaul80))
