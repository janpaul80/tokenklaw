# CodexAdapter Design

**Status**: Investigation
**Found**: Real runtime present with 62KB state

## Current State

| Item | Finding |
|------|---------|
| Directory | `~/.codex/` |
| Files | 62KB+ state files (not TokenKlaw) |
| Binary | Codex CLI |
| TokenKlaw | NOT installed |

## Discovery

```
~/.codex/
  .codex-global-state.json      (62KB)
  .codex-global-state.json.bak  (62KB)
  .personality_migration
  .sandbox/
  .sandbox-bin/
  .sandbox-secrets/
  .tmp/
```

## Gap Analysis

| Requirement | Status |
|--------------|--------|
| Codex runtime | ✅ EXISTS |
| TokenKlaw target | ❌ NOT configured |
| Installation | Needed |
| Consumption | Not tested |

## Design (When Enabled)

```typescript
class CodexAdapter implements RuntimeAdapter {
  readonly agent = 'codex';
  readonly name = 'Codex CLI';
  readonly runtimeStatus: 'scaffolded' = 'scaffolded';

  async detect(): Promise<boolean> {
    // Check for .codex directory
    return fs.existsSync(path.join(os.homedir(), '.codex'));
  }

  async install(): Promise<InstallResult> {
    // Install TokenKlaw to .codex/
  }

  async validate(): Promise<ValidationResult> {
    // Current: Files exist
    // Need: Prove Codex reads them
  }
}
```

## Recommendation

1. Add Codex as TokenKlaw target (it exists!)
2. Run install
3. Verify consumption in Codex CLI