# CodexAdapter Design - Updated

**Status**: Design/Investigation  
**Last Updated**: 2026-05-31

## Problem

TokenKlaw writes to: `~/.codex/tokenklaw/`  
But Codex loads from: `~/.codex/skills/` and `~/.codex/rules/`

**No consumption** - installation path mismatch!

## Current Discovery

### Codex Loading Paths (from logs + file inspection)

| Path | Purpose | Status |
|------|--------|--------|
| `~/.codex/skills/{name}/` | Custom skills | ✅ Codex loads |
| `~/.codex/rules/default.rules` | Rules | ✅ Codex loads |
| `~/.codex/tokenklaw/` | TokenKlaw target | ❌ NOT loaded |
| `~/.codex/config.toml` | Config | ✅ Codex loads |

### TokenKlaw Installation Paths (Current - WRONG!)

```
~/.codex/tokenklaw/
  tokenklaw.rules.md          # Written here
  tokenklaw.skill.md        # Written here
  tokenklaw.prompt.md       # Written here
  runtime-capabilities.json
  runtime-notes.md
```

**This is wrong because Codex doesn't read from this path!**

---

## Correct Installation Targets

### Option A: Skills Path

**Path**: `~/.codex/skills/tokenklaw/`

**Format**: 
```
~/.codex/skills/tokenklaw/
  skill.md        # Main skill definition
  prompts/       # Prompt templates
  rules/         # Token rules
  config.json    # Skill config
```

**Pros**:
- Direct skill loading via Codex's skill mechanism
- Well-documented

**Cons**:
- Need to understand Codex skill format

### Option B: Rules Path

**Path**: `~/.codex/rules/tokenklaw.rules`

**Format**: Same as Codex default.rules format

**Pros**:
- Direct rule injection
- Simple text-based

**Cons**:
- Need to understand Codex rules syntax

### Option C: Plugin Path

**Path**: `~/.codex/tokenklaw/codex-plugin/`

**Pros**:
- Full plugin capabilities
- Can have prompts, hooks, etc.

**Cons**:
- More complex

---

## Migration Plan

### Step 1: Modify Installation

Change installer to write to correct paths:

```typescript
// Current (WRONG)
const target = '~/.codex/tokenklaw/';

// Correct Option A (Skills)
const targetSkill = '~/.codex/skills/tokenklaw/';
const targetRules = '~/.codex/rules/tokenklaw.rules';
```

### Step 2: Maintain Backward Compatibility

Keep old path for detection but add new paths:

```
~/.codex/
  tokenklaw/                    # Old (keep for detection)
    runtime-capabilities.json   # Keep for detection
  skills/
    tokenklaw/              # NEW - actual consumption
  rules/
    tokenklaw.rules        # NEW - actual consumption
```

---

## Validation Requirements

To move from Investigation → Scaffolded → Validated:

### Investigation (Current)
- [x] Runtime exists
- [x] Skills mechanism discovered
- [x] Rules mechanism discovered
- [x] Wrong installation path identified

### Scaffolded (Target)
- [ ] TokenKlaw writes to correct skills path
- [ ] TokenKlaw writes to correct rules path
- [ ] Files verified in correct locations
- [ ] Codex can detect custom skills

### Validated (Goal)
- [ ] Codex loads skill from ~/.codex/skills/tokenklaw/
- [ ] Codex applies rules from ~/.codex/rules/tokenklaw.rules
- [ ] Behavior changes when enabled/disabled
- [ ] Command recognition works

---

## Pass/Fail Criteria

**PASS** (Move to Scaffolded):
- [ ] TokenKlaw installs to ~.codex/skills/tokenklaw/
- [ ] Files exist in correct location
- [ ] Codex detects custom skill

**FAIL** (Remain Investigation):
- [ ] Cannot modify installer
- [ ] Codex doesn't load from new paths
- [ ] No skill format documentation

---

## Recommended Implementation

**Option A** (Skills path):

1. Change CodexInstaller to write to `~/.codex/skills/tokenklaw/`
2. Add skill.md with token budget rules
3. Test with Codex CLI

**Why**: Direct integration, Codex already has skills loader

---

## Current Status

**Codex**: Investigation

**Next**: If design approved → Modify installer → Move to Scaffolded

---

## References

- `.codex/skills/.system/` - Existing skills
- `.codex/rules/default.rules` - Rules format (75KB)
- `config.toml` - Plugin/config format