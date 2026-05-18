param(
  [string]$Runtime = "",
  [string]$Dir = "$HOME\tokenklaw",
  [switch]$SkipBuild,
  [switch]$NonInteractive,
  [switch]$Help
)

$ErrorActionPreference = "Stop"

function Show-Usage {
  @"
TokenKlaw one-line installer (Windows PowerShell)

Usage:
  .\install.ps1 [options]

Options:
  -Runtime <id|all>   Optional runtime install after build (claude|gemini|antigravity|openclaw|hermes|roo|cursor|cline|all)
  -Dir <path>         Install/update directory (default: ~\tokenklaw)
  -SkipBuild          Skip pnpm build step
  -Help               Show help

Examples:
  .\install.ps1 -Runtime claude
  .\install.ps1 -Runtime all -Dir C:\dev\tokenklaw
"@
}

function Log([string]$Message) {
  Write-Host "[TokenKlaw] $Message" -ForegroundColor Cyan
}
function Warn([string]$Message) {
  Write-Host "[TokenKlaw] $Message" -ForegroundColor Yellow
}
function Fail([string]$Message) {
  Write-Host "[TokenKlaw] $Message" -ForegroundColor Red
  exit 1
}

function Ensure-Command([string]$Name, [string]$Hint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Fail "$Name is required. $Hint"
  }
}

function Ensure-Node {
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "Node.js is required but not found. Install Node 20+ and rerun."
  }
  Log "Node detected: $(node -v)"
}

function Ensure-Pnpm {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Log "pnpm detected: $(pnpm -v)"
    return
  }

  Warn "pnpm not found. Attempting Corepack enable..."
  $corepack = Get-Command corepack -ErrorAction SilentlyContinue
  if ($corepack) {
    try {
      corepack enable | Out-Null
      corepack prepare pnpm@latest --activate | Out-Null
      if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        Log "pnpm enabled via Corepack."
        return
      }
    } catch {
      Warn "Corepack path failed or permission denied. Falling back to npm global install."
    }
  } else {
    Warn "Corepack not found. Falling back to npm global install."
  }

  Ensure-Command "npm" "Install Node.js/npm and rerun."
  npm install -g pnpm
  if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Fail "pnpm installation failed."
  }
  Log "pnpm installed: $(pnpm -v)"
}

function Clone-Or-Update {
  $repoUrl = "https://github.com/janpaul80/tokenklaw.git"

  if (Test-Path (Join-Path $Dir ".git")) {
    Log "Existing TokenKlaw repo found at: $Dir"
    git -C $Dir fetch --all --prune
    git -C $Dir pull --ff-only
  } else {
    $parent = Split-Path -Parent $Dir
    if (-not (Test-Path $parent)) {
      New-Item -ItemType Directory -Path $parent | Out-Null
    }
    Log "Cloning TokenKlaw into: $Dir"
    git clone $repoUrl $Dir
  }
}

function Run-InstallFlow {
  Log "Installing dependencies..."
  pnpm -C $Dir install

  if (-not $SkipBuild) {
    Log "Building workspace..."
    pnpm -C $Dir -r build
  } else {
    Warn "Skipping build per -SkipBuild"
    $cliDist = Join-Path $Dir "apps/cli/dist/index.js"
    if (-not (Test-Path $cliDist)) {
      Warn "CLI dist missing while -SkipBuild is set. Building required workspace dependency chain."
      pnpm -C $Dir --filter @tokenklaw/shared run build
      pnpm -C $Dir --filter @tokenklaw/providers run build
      pnpm -C $Dir --filter @tokenklaw/analytics run build
      pnpm -C $Dir --filter @tokenklaw/core run build
      pnpm -C $Dir --filter @tokenklaw/cli run build
    }
  }

  $cliDist = Join-Path $Dir "apps/cli/dist/index.js"
  if (-not (Test-Path $cliDist)) {
    Fail "CLI binary not found at $cliDist after build step."
  }

  Log "Running doctor..."
  node $cliDist doctor
}

function Normalize-Runtime([string]$Value) {
  switch ($Value.ToLowerInvariant()) {
    "antigravity" { return "gemini" }
    "claude" { return "claude" }
    "gemini" { return "gemini" }
    "openclaw" { return "openclaw" }
    "hermes" { return "hermes" }
    "roo" { return "roo" }
    "cursor" { return "cursor" }
    "cline" { return "cline" }
    "all" { return "all" }
    "" { return "" }
    default { Fail "Unsupported runtime '$Value'. Supported: claude, gemini, antigravity, openclaw, hermes, roo, cursor, cline, all" }
  }
}

function Show-RuntimeStatus {
  @"
Runtime status:
- Claude Code: working plugin integration
- Gemini / Antigravity: experimental
- OpenClaw: experimental
- Hermes: experimental
- Roo/Cursor/Cline: pending validation
"@
}

function Prompt-RuntimeMenu {
  Write-Host ""
  Write-Host "Where do you want to install TokenKlaw?"
  Write-Host ""
  Write-Host "[1] Claude Code"
  Write-Host "[2] Gemini / Antigravity"
  Write-Host "[3] OpenClaw"
  Write-Host "[4] Hermes"
  Write-Host "[5] Roo Code"
  Write-Host "[6] Cursor"
  Write-Host "[7] Cline"
  Write-Host "[A] All"
  Write-Host "[S] Skip agent install for now"
  Write-Host ""

  $choice = Read-Host "Select option"
  switch ($choice.ToUpperInvariant()) {
    "1" { return "claude" }
    "2" { return "gemini" }
    "3" { return "openclaw" }
    "4" { return "hermes" }
    "5" { return "roo" }
    "6" { return "cursor" }
    "7" { return "cline" }
    "A" { return "all" }
    "S" { return "" }
    default {
      Warn "Invalid selection. Skipping agent install."
      return ""
    }
  }
}

function Run-RuntimeInstall {
  if ([string]::IsNullOrWhiteSpace($Runtime) -and -not $NonInteractive) {
    $Runtime = Prompt-RuntimeMenu
  }

  $Runtime = Normalize-Runtime $Runtime

  if ([string]::IsNullOrWhiteSpace($Runtime)) {
    Log "Skipping runtime install."
    Show-RuntimeStatus
    return
  }

  $cliDist = Join-Path $Dir "apps/cli/dist/index.js"
  if (-not (Test-Path $cliDist)) {
    Fail "CLI binary not found at $cliDist. Run without -SkipBuild or build @tokenklaw/cli first."
  }

  Log "Installing runtime artifacts for: $Runtime"
  node $cliDist install $Runtime
  Show-RuntimeStatus
}

if ($Help) {
  Show-Usage
  exit 0
}

Ensure-Command "git" "Install Git and rerun."
Ensure-Node
Ensure-Pnpm
Clone-Or-Update
Run-InstallFlow
Run-RuntimeInstall

Log "Installation complete."
Log "Repo: $Dir"
Log "Run: node $(Join-Path $Dir 'apps/cli/dist/index.js') --help"
