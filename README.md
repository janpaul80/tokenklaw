# TokenKlaw

![TokenKlaw logo](https://raw.githubusercontent.com/janpaul80/tokenklaw/main/assets/logo.png)

Save tokens across AI coding agents.

TokenKlaw is a local-first token-saving layer between your coding agent and model provider. It cuts repeated context, duplicate logs, and redundant prompts before they burn budget.

Created by Paul Hartmann ([@janpaul80](https://github.com/janpaul80))

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-local-003b57.svg)](https://www.sqlite.org/index.html)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-43853d.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220.svg)](https://pnpm.io/)
[![Status](https://img.shields.io/badge/status-active%20development-6f42c1.svg)](#roadmap)

**Works with:** Claude Code, Codex CLI, Roo Code, Cline, Continue, Gemini / Antigravity, OpenClaw, KLAW, and future adapters.

## Navigation
[Overview](#overview) • [Quick Start (Activation)](#quick-start-activation-first) • [Install](#install) • [Benchmarks](#benchmarks) • [Platforms](#platform-support) • [CLI Examples](#cli-examples) • [Roadmap](#roadmap)

## Overview

TokenKlaw sits in the request path:

```text
Agent -> TokenKlaw -> Fingerprint + Context Reduction + Cache -> Provider
```

What it does in practice:

- fingerprints requests to detect repeats
- strips noisy or duplicated context
- caches deterministic results
- tracks usage and savings

## Before / After

### 1) React rerender debugging

**Without TokenKlaw**
```text
Sure! Let me explain your React issue in detail. The component re-renders on every state
change because you're creating a new inline object reference each render. React compares by
reference, so this object is always "different". Consider useMemo, stable callbacks, and
prop drilling analysis...
[1,280 tokens]
```

**With TokenKlaw**
```text
Rerender is caused by a new inline object ref each render.
Fix: memoize the object with useMemo and pass stable props.
[312 tokens]
```

Saved: **75%**

### 2) Auth middleware bug summary

**Without TokenKlaw**
```text
Your middleware checks auth headers in multiple branches and logs full request objects.
Here is a full breakdown of each branch, response mode, and error path...
[2,050 tokens]
```

**With TokenKlaw**
```text
Duplicate auth checks in middleware.
Consolidate to one guard, avoid full request logging, short-circuit on missing token.
[640 tokens]
```

Saved: **69%**

### 3) Repeated repo analysis (same question, second run)

**Without TokenKlaw**
```text
Full architecture walkthrough regenerated from scratch.
[12,000 tokens]
```

**With TokenKlaw**
```text
Cache hit: previous response reused.
[0 provider tokens]
```

Saved: **up to 100%** on repeat calls

## Token chart (example repeated-context workflow)

```text
Before           ████████████████████ 12,000
After TokenKlaw  ██████                3,480
Saved            71%
```

## Quick start (activation-first)

1) Install TokenKlaw locally.

2) Install into your agent:

```bash
tokenklaw install claude
# or: tokenklaw install codex|roo|cline|continue|gemini|all
```

3) Inside your agent chat, activate token-saving mode:

```text
/tokenklaw
# alias:
/tk
```

Expected activation response:

```text
TokenKlaw active.
Context reduction: on
Duplicate detection: on
Cache guidance: on
Verbose replies: reduced
Token-saving mode: enabled
```

To disable or inspect mode:

```text
/tokenklaw off
/tokenklaw stats
```

## Install

### Requirements

- **Recommended Node.js:** 20 LTS or 22 LTS
- `pnpm` via corepack
- On Windows, native modules may require Visual Studio Build Tools

> Note: Node 24 can fail on Windows when building `better-sqlite3` from source.

### From source (PowerShell)

```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor
```

### From source (WSL / Linux / macOS)

```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor
```

### npm (coming soon)

```bash
npm install -g tokenklaw
```

## Benchmarks

Example repeated-context scenarios (illustrative, workflow-dependent):

| Task | Without | With TokenKlaw | Saved |
| ---- | ------: | -------------: | ----: |
| Repeated repo analysis | 12,000 | 3,480 | 71% |
| Duplicate logs in debug flow | 8,500 | 4,200 | 50% |
| Repeated stack trace explanation | 5,200 | 2,100 | 60% |
| Cache hit on exact repeat | 6,000 | 0 provider tokens | up to 100% |

## Platform support

| Platform | Status |
| -------- | ------ |
| Claude Code | planned |
| Codex CLI | planned |
| Roo Code | planned |
| Cline | planned |
| Continue | planned |
| Gemini / Antigravity | planned |
| OpenClaw | planned |
| KLAW | planned |

## CLI examples

### Run

```bash
tokenklaw run "explain this repo architecture"
```

```text
provider: anthropic
fingerprint: 4e4f2f6a...
cache: miss
input_tokens: 2381
output_tokens: 1099
estimated_cost_usd: 0.0214
saved_tokens_estimate: 0
```

### Run again (same request)

```bash
tokenklaw run "explain this repo architecture"
```

```text
provider: anthropic
fingerprint: 4e4f2f6a...
cache: hit
input_tokens: 0 provider tokens
output_tokens: cached
estimated_cost_usd: 0.0000
saved_tokens_estimate: 2381
```

### Stats

```bash
tokenklaw stats
```

```text
requests_total: 147
cache_hit_rate: 42.2%
input_tokens_baseline: 418,220
input_tokens_actual: 161,570
estimated_tokens_saved: 256,650
estimated_reduction: 61.4%
```

### Inspect

```bash
tokenklaw inspect --limit 5
```

```text
#   ts                  provider   cache   input   output   saved
1   2025-07-16T10:41Z   openai     hit     0       cached   1810
2   2025-07-16T10:39Z   openai     miss    1810    420      0
3   2025-07-16T10:31Z   anthropic  hit     0       cached   2381
4   2025-07-16T10:28Z   anthropic  miss    2381    1099     0
5   2025-07-16T10:22Z   openai     miss    1220    360      0
```

## Architecture

```text
┌──────────────┐
│ AI Agent     │
└──────┬───────┘
       │ request
       v
┌──────────────┐
│ TokenKlaw    │
│ - fingerprint│
│ - reduction  │
│ - cache      │
└──────┬───────┘
       │ optimized request
       v
┌──────────────┐
│ Provider API │
│ OpenAI / etc │
└──────────────┘
```

## Troubleshooting install issues

If `pnpm install` fails on `better-sqlite3`:

1. Use **Node 20 LTS** or **Node 22 LTS**
2. Install **Visual Studio Build Tools** with **Desktop development with C++**
3. Retry `pnpm install`
4. If Windows native build still fails, try running in **WSL/Linux**

## Roadmap

- ship stable CLI command surface (`run`, `stats`, `inspect`)
- expand provider adapters beyond skeleton implementations
- publish npm package
- add adapter-specific benchmark harness
- harden cache invalidation + policy controls

## License

MIT © Paul Hartmann ([@janpaul80](https://github.com/janpaul80))
