# TokenKlaw Runtime Discovery Report

**Date**: 2026-05-31  
**Purpose**: Document which runtimes actually exist in environment

## Summary

| Status | Count | Runtimes |
|--------|-------|----------|
| **Validated** | 1 | Claude Code |
| **Scaffolded** | 5 | Cursor, Cline, Continue, Roo, Hermes |
| **Found (not TokenKlaw target)** | 1 | Codex |
| **Issue** | 2 | OpenClaw, Hermes |
| **Need Review** | 2 | OpenCode, OpenDevin |

---

## Detailed Findings

### ✅ VALIDATED: Claude Code

| Item | Finding |
|------|---------|
| Directory | `~/.claude/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ✅ Present (skills/, hooks/, commands/) |
| Detection | Working |
| Consumption | PROVEN |

**Proof**: Verified via ClaudeAdapter

---

### FOUND: Codex CLI

| Item | Finding |
|------|---------|
| Directory | `~/.codex/` |
| TokenKlaw files | ❌ None |
| Runtime files | ✅ EXISTS (220KB state files!) |
| Detection | Binary in PATH (found 219MB of state) |

**Note**: CodeX was not a TokenKlaw target before this shows it EXISTS!

---

### SCFFOLDED: Cursor

| Item | Finding |
|------|---------|
| Directory | `~/.cursor/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ✅ Present |
| Status | **Scaffolded** - needs validation |

---

### SCAFFOLDED: Cline

| Item | Finding |
|------|---------|
| Directory | `~/.cline/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ✅ Present (VS Code extension) |
| Status | **Scaffolded** - needs validation |

---

### SCAFFOLDED: Continue

| Item | Finding |
|------|---------|
| Directory | `~/.continue/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ✅ Present |
| Status | **Scaffolded** - needs validation |

---

### SCAFFOLDED: Roo

| Item | Finding |
|------|---------|
| Directory | `~/.roo/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ✅ Present |
| Status | **Scaffolded** - needs validation |

---

### ❌ ISSUE: OpenClaw

| Item | Finding |
|------|---------|
| Directory | `~/.openclaw/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ❌ **NOT FOUND** |
| Expected | `agents/`, `memory/`, `plugins/`, `plugin-skills/`, `tasks/`, `workspace/`, `logs/` |
| Actual | Only `tokenklaw/` subdirectory |

**ISSUE**: User reports OpenClaw should have runtime files, but none found.

**Possible causes**:
1. OpenClaw moved
2. Different profile path
3. Previously existed, now removed
4. Uses different config location

**Action needed**: Verify OpenClaw location

---

### ❌ ISSUE: Hermes

| Item | Finding |
|------|---------|
| Directory | `~/.hermes/` |
| TokenKlaw files | ✅ Present |
| Runtime files | ❌ NOT FOUND |
| Expected | `startup/`, `memory/`, `skills/` |
| Actual | Only `tokenklaw/` subdirectory |

**ISSUE**: Same issue - no runtime files found

---

### NEED REVIEW: OpenCode

| Item | Finding |
|------|---------|
| Directory | `~/.opencode/` |
| TokenKlaw files | ❌ None (not targeted) |
| Runtime files | Need verification |

---

### NEED REVIEW: OpenDevin

| Item | Finding |
|------|---------|
| Directory | `~/.opendevin/` |
| TokenKlaw files | ❌ None (not targeted) |
| Runtime files | Need verification |

---

## Files Generated vs Runtime Files

| Runtime | TokenKlaw Generates | Own Runtime Files | Owns Files? |
|---------|-------------------|-------------------|-------------|
| Claude | ✅ | ✅ | YES |
| Codex | ❌ | ✅ | YES (not TK target) |
| Cursor | ✅ | ✅ | YES |
| Cline | ✅ | ✅ | YES |
| Continue | ✅ | ✅ | YES |
| Roo | ✅ | ✅ | YES |
| OpenClaw | ��� | ❌ | **NO** |
| Hermes | ✅ | ❌ | **NO** |
| OpenCode | ❌ | ? | ? |
| OpenDevin | ❌ | ? | ? |

## Recommendations

1. **Codex** should become a TokenKlaw target - it's already installed
2. **OpenClaw/Hermes** - need location verification from user
3. **Cursor, Cline, Continue, Roo** - remain Scaffolded until validation proves consumption

## Environment

**User profile**: `C:\Users\hartm\`  
**Shell**: PowerShell/Bash hybrid on Windows 11