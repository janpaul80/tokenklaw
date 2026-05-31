# HermesAdapter Design

**Status**: Design Only - Not Implemented  
**Blocked By**: No verified consumption path

## Rationale

Hermes is currently "Scaffolded" - TokenKlaw generates files but we don't know if Hermes consumes them.

## Current State

| Item | Finding |
|------|---------|
| Config directory | `~/.hermes/tokenklaw/` (only TokenKlaw files) |
| Binary in PATH | ❌ Not found |
| NPM package | ❌ Not found |
| Additional files | ❌ None found |

## Files Generated for Hermes

```
~/.hermes/tokenklaw/
  tokenklaw.rules.md          # Token budget rules
  tokenklaw.skill.md         # Skill definition  
  tokenklaw.prompt.md        # Prompt template
  tokenklaw.slash-commands.md
  runtime-capabilities.json
  runtime-notes.md
  startup-context.md         # Startup context compression
  middleware.memory-compression.md  # Memory compression
```

## Gap Analysis

| Requirement | Status |
|--------------|--------|
| Hermes runtime location | ❌ NOT FOUND |
| Startup instruction path | ❌ UNKNOWN |
| Memory path | ❌ UNKNOWN |
| Prompt injection path | ❌ UNKNOWN |
| Skill loading | ❌ UNKNOWN |
| Command support | ❌ UNKNOWN |
| Hook support | ❌ UNKNOWN |

## Design (When Enabled - Placeholder)

```typescript
class HermesAdapter implements RuntimeAdapter {
  readonly agent = 'hermes';
  readonly name = 'Hermes';
  readonly runtimeStatus: 'scaffolded' = 'scaffolded';

  private get tokenklawDir(): string {
    return path.join(os.homedir(), '.hermes', 'tokenklaw');
  }

  async detect(): Promise<boolean> {
    // Current: Directory exists check
    // Need: Find actual Hermes runtime
    return fs.existsSync(path.join(os.homedir(), '.hermes'));
  }

  async install(): Promise<InstallResult> {
    // Use existing HermesInstaller
    const target = new HermesInstaller().buildTarget();
    // Write files...
  }

  async activate(mode: 'on' | 'off'): Promise<ActivationResult> {
    // UNKNOWN - Need Hermes docs
    throw new Error('Hermes activation mechanism unknown');
  }

  async validate(): Promise<ValidationResult> {
    // Current: File existence only
    // Future: Must prove Hermes reads files
    return {
      valid: true,
      runtimeConsumes: false,  // Key gap!
      evidence: ['Files exist'],
      gaps: ['Not consumed', 'No activation', 'No status']
    };
  }
}
```

## Validation Requirements

To become "Validated":

| Requirement | Current | Needed |
|--------------|---------|---------|
| Files generated | ✅ | - |
| Files consumed | ❌ | PROOF |
| Start context loaded | ❌ | PROOF |
| Memory rules applied | ❌ | PROOF |
| Activation works | ❌ | PROOF |
| Status output | ❌ | PROOF |

## Questions to Resolve

Before implementing, need answers:

1. What's the Hermes runtime location?
2. Where does it read startup context?
3. What file formats does it support?
4. Does it have skill/plugin system?
5. Does it support commands?
6. Does it have hooks?

## Recommendation

**Remain at "Scaffolded"** until:
1. Hermes runtime is located
2. Consumption is proven
3. Activation mechanism is identified

## Classification

Hermes: **Scaffolded** (files generated, consumption unproven)

Same as OpenClaw - we generate files but prove nothing works.