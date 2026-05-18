# TokenKlaw One-Line Install

Official website: https://token.klaw.at

## macOS / Linux / WSL

```bash
curl -fsSL https://token.klaw.at/install.sh | bash
```

GitHub raw fallback:

```bash
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash
```

With runtime install:

```bash
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash -s -- --runtime claude
curl -fsSL https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.sh | bash -s -- --runtime all
```

## Windows PowerShell

```powershell
irm https://token.klaw.at/install.ps1 | iex
```

GitHub raw fallback:

```powershell
irm https://raw.githubusercontent.com/janpaul80/tokenklaw/main/install.ps1 | iex
```

## Installer Flags

### install.sh (bash)

- `--runtime <id|all>`
- `--dir <path>`
- `--skip-build`
- `--help`

### install.ps1 (PowerShell)

- `-Runtime <id|all>`
- `-Dir <path>`
- `-SkipBuild`
- `-Help`

## Runtime Examples

```bash
bash install.sh --runtime claude
bash install.sh --runtime roo
bash install.sh --runtime all
```

```powershell
.\install.ps1 -Runtime claude
.\install.ps1 -Runtime all
```

## What installer does

- Detects environment/OS
- Checks `git`
- Checks `node`
- Checks `pnpm`
- Tries Corepack first for pnpm
- Falls back to global pnpm install when needed
- Clones or updates TokenKlaw
- Installs dependencies
- Builds workspace (unless skipped)
- Runs doctor
- Optionally runs runtime installation

## Verification Commands

```bash
node apps/cli/dist/index.js doctor
node apps/cli/dist/index.js install claude --dry-run
node apps/cli/dist/index.js install claude
```

## Troubleshooting

1) **Node missing**
- Install Node.js 20+ and retry.

2) **pnpm missing**
- Script attempts Corepack.
- If Corepack fails, script falls back to npm global pnpm install.

3) **Permission issues (Windows Corepack)**
- Run PowerShell as Administrator once, or rely on npm fallback.

4) **Git missing**
- Install Git and retry installer.

5) **Build fails**
- Run manually:
  - `pnpm install`
  - `pnpm -r build`
  - `pnpm --filter @tokenklaw/cli run doctor`
