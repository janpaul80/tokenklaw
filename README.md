# TokenKlaw

![TokenKlaw logo](https://raw.githubusercontent.com/janpaul80/tokenklaw/main/assets/logo.png)

**Save tokens across AI coding agents**

TokenKlaw reduces duplicated prompts, repeated repo context, noisy logs, and repeated provider calls. Works with Claude Code, Codex CLI, Roo Code, Cline, Continue, Gemini tooling, and more.

---

## Overview • Install • Benchmarks • Platforms • Examples • Roadmap

---

### What it is
A lightweight, local‑first token‑optimization layer for AI coding tools. It deduplicates input, caches repeat requests, and reports token usage.

### Why it matters
Token consumption translates directly to cost. By stripping redundancy TokenKlaw can lower token usage by **~70 %** in repeated‑context workflows, saving money and speeding up responses.

---

## Before / After examples

**Without TokenKlaw**
```
Sure! Let me explain your React issue in detail. The component re‑renders on every state change because you create a new object inline. You can memoize the object with useMemo to avoid the extra renders.
[1,280 tokens]
```
**With TokenKlaw**
```
React rerender caused by inline object ref. Memoize object with useMemo.
[312 tokens]
```
**Reduction:** 75 %

**Another scenario**
```
Before: ████████████████████ 12,000 tokens
After : ████ 3,480 tokens
Saved : 71 %
```
---

## Install from source

### Windows PowerShell
```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor
```

### WSL / Linux / macOS
```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm doctor
```
---

## Future npm install
```bash
npm install -g tokenklaw
```
*Coming soon once published to npm.*
---

## Benchmarks (example repeated‑context scenarios)
| Task | Without TokenKlaw | With TokenKlaw | Reduction |
| ---- | ----------------: | -------------: | --------: |
| Repeated repo analysis | 12,000 tokens | 3,480 tokens | 71 % |
| Duplicate logs | 8,500 tokens | 4,200 tokens | 50 % |
| Cache hit on repeat request | 6,000 tokens | 0 provider tokens | up to 100 % |

*Numbers illustrative; real savings depend on workflow.*
---

## Supported platforms
| Platform | Status |
| -------- | ------ |
| Claude Code | planned |
| Codex CLI | planned |
| Roo Code | planned |
| Cline | planned |
| Continue | planned |
| Gemini / Antigravity | planned |
| OpenClaw | planned |
| KLAW | planned |
---

## CLI usage examples
```bash
tokenklaw run "explain this repo architecture"
# first run – full request
# second run – cache hit

tokenklaw stats
# shows request count, token reduction, cache‑hit rate

tokenklaw inspect --limit 5
# recent request records
```
---

## Architecture (high‑level)
```
Agent → TokenKlaw → Fingerprint / Context reduction / Cache → Provider
```
---

## Project status
- Early open‑source project, monorepo layout
- npm package forthcoming
- Adapter skeletons in `apps/cli/src/adapters/`
- Install from source as shown above
---

## License
MIT © Paul Hartmann (@janpaul80)
