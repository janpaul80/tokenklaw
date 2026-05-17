# TokenKlaw Installation

## Prerequisites

- **Recommended Node.js:** 20 LTS or 22 LTS (`node --version`)
- Git
- corepack (ships with modern Node)
- Windows: PowerShell 5+  
  Linux/macOS: any POSIX shell
- Node 24 may fail on Windows when `better-sqlite3` must compile from source
- For `better-sqlite3` native builds, you may need:
  - Windows: Visual Studio Build Tools + **Desktop development with C++**
  - Debian/Ubuntu: `build-essential libsqlite3-dev`
  - macOS: `brew install sqlite3`

## Clone

```bash
git clone https://github.com/janpaul80/tokenklaw.git
cd tokenklaw
```

## Enable pnpm via corepack

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Install + build

```bash
pnpm install
pnpm build
```

## Verify setup

```bash
pnpm doctor
```

Expected: checks pass for Node, pnpm, SQLite driver, and schema/provider setup.

## Quick smoke test

```bash
tokenklaw run "explain this repo architecture"
tokenklaw run "explain this repo architecture"
tokenklaw stats
```

The second `run` should report a cache hit.

## Troubleshooting

- **`better-sqlite3` build errors on Windows**  
  1) switch to Node 20/22 LTS  
  2) install Visual Studio Build Tools with Desktop development with C++  
  3) retry `pnpm install`  
  4) if needed, use WSL/Linux
- **`better-sqlite3` build errors on Linux/macOS**  
  Install toolchain/dev headers:
  - Debian/Ubuntu: `sudo apt-get install build-essential libsqlite3-dev`
  - macOS: `brew install sqlite3`
- **`pnpm` not found**  
  Re-run corepack commands above, then check `pnpm --version`.
- **permission denied on Unix**  
  Try `chmod +x dist/index.js` after build.

For full usage examples, see `README.md`.
