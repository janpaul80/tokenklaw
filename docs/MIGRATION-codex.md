# Codex Migration Proposal

**Status**: Design - Not Implemented  
**Date**: 2026-05-31

---

## Current State

### Where TokenKlaw Currently Installs
```
~/.codex/tokenklaw/           ← WRONG PATH (Codex doesn't read this)
  tokenklaw.rules.md
  tokenklaw.skill.md
  tokenklaw.prompt.md
  tokenklaw.slash-commands.md
  runtime-capabilities.json
  runtime-notes.md
```

### Where Codex Actually Loads From
```
~/.codex/skills/             ← Codex reads FROM HERE
  .system/                  ← System skills
  pdf/
  playwright/

~/.codex/rules/              ← Codex reads FROM HERE
  default.rules             ← 75KB rules file
```

---

## Migration Plan: Current → Future

### Files That Would Move

| File (Current) | File (Future) | Notes |
|---------------|---------------|-------|
| `tokenklaw.rules.md` | `~/.codex/rules/tokenklaw.rules` | Rename to .rules format |
| `tokenklaw.skill.md` | `~/.codex/skills/tokenklaw/skill.md` | New skill directory |
| `tokenklaw.prompt.md` | `~/.codex/skills/tokenklaw/prompts/main.md` | Prompt templates |
| (new) | `~/.codex/skills/tokenklaw/config.json` | Skill configuration |

### Files That Remain (Backward Compatibility)

| File | Location | Purpose |
|------|----------|---------|
| `runtime-capabilities.json` | `~/.codex/tokenklaw/runtime-capabilities.json` | Detection only |
| `runtime-notes.md` | `~/.codex/tokenklaw/runtime-notes.md` | Documentation only |

---

## Migration Checklist

### Phase 1: Detection Updates

- [ ] Update `detect()` to check both old and new paths
- [ ] Check `~/.codex/skills/tokenklaw/` exists
- [ ] Check `~/.codex/rules/tokenklaw.rules` exists

### Phase 2: Installation Updates

- [ ] Modify CodexInstaller to write to new paths
- [ ] Write skill to `~/.codex/skills/tokenklaw/`
- [ ] Write rules to `~/.codex/rules/tokenklaw.rules`
- [ ] Keep old path for backward compatibility

### Phase 3: Validation Updates

- [ ] Update validation to check new paths
- [ ] Verify skills/ loads skill
- [ ] Verify rules/ loads rules

### Phase 4: Testing

- [ ] Dry run install
- [ ] Verify files in new locations
- [ ] Run Codex, verify skill appears
- [ ] Test token budget in prompts

---

## Rollback Plan

If migration fails:

1. Keep old installer logic in place
2. Feature flag: `--legacy` for old path
3. Revert to old paths if issues detected

```typescript
// Rollback flag
interface InstallOptions {
  dryRun?: boolean;
  legacy?: boolean;  // Use old paths if true
  force?: boolean;
}
```

---

## Implementation Priority

1. **Detection** - Check both paths
2. **Install** - Write to new paths + keep old
3. **Validate** - Check new paths
4. **Test** - Verify in Codex

---

## Pass/Fail Criteria

**PASS**:
- [ ] Install creates `~/.codex/skills/tokenklaw/`
- [ ] Install creates `~/.codex/rules/tokenklaw.rules`
- [ ] Old ~.codex/tokenklaw/ still exists (backward compat)
- [ ] Codex detects custom skill

**FAIL**:
- [ ] Codex doesn't load new paths
- [ ] Backward compatibility broken
- [ ] Installation errors

---

## Current Status

**Codex: Investigation → (After Migration) → Scaffolded**

The migration plan is complete. Waiting for implementation approval.