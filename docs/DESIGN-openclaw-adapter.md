# OpenClawAdapter Design

**Status**: Design Only - Not Implemented  
**Blocked By**: No verified consumption path

## Rationale

OpenClaw is currently "Scaffolded" - TokenKlaw generates files but we don't know if OpenClaw consumes them.

We cannot implement an adapter that wraps unknown consumption paths.

## Required Before Implementation

### 1. Consumption Path Discovery

Need to verify:
- [ ] Where does OpenClaw read startup context?
- [ ] Where does OpenClaw read memory/middleware?
- [ ] What file formats does OpenClaw support?
- [ ] How does OpenClaw load plugins/extensions?

### 2. Integration Points

Possible integration points:

| Point | Location | Format |
|-------|----------|--------|
| Startup context | TBD | .md / .json |
| Memory rules | TBD | .md / .json |
| Middleware | TBD | .md / .json |
| Commands | TBD | .md / .json |
| Config | TBD | .json / .toml |

### 3. Activation Mechanism

How would `/tokenklaw` be recognized?
- [ ] Slash command support?
- [ ] Config-based activation?
- [ ] Environment variable?
- [ ] Plugin system?

### 4. Validation Requirements

To become "Validated":

| Requirement | Current | Needed |
|--------------|---------|---------|
| Files generated | ✅ | - |
| Files consumed | ❌ | PROOF |
| Command recognized | ❌ | PROOF |
| Hook execution | ❌ | PROOF |
| Status output | ❌ | PROOF |
| Behavior change | ❌ | PROOF |

## Design (When Enabled)

```typescript
class OpenClawAdapter implements RuntimeAdapter {
  readonly agent = 'openclaw';
  readonly name = 'OpenClaw';
  readonly runtimeStatus: 'scaffolded' = 'scaffolded';  // Until proven

  private get tokenklawDir(): string {
    return path.join(os.homedir(), '.openclaw', 'tokenklaw');
  }

  async detect(): Promise<boolean> {
    // Check for OpenClaw installation
    return fs.existsSync(path.join(os.homedir(), '.openclaw'));
  }

  async install(): Promise<InstallResult> {
    // Use existing OpenClawInstaller
    const target = new OpenClawInstaller().buildTarget();
    // Write files...
  }

  async activate(mode: 'on' | 'off'): Promise<ActivationResult> {
    // UNKNOWN - We don't know how OpenClaw activates
    throw new Error('OpenClaw activation mechanism unknown');
  }

  async validate(): Promise<ValidationResult> {
    // Current: Check files exist
    // Future: Check if OpenClaw actually reads them
    const evidence: string[] = [];
    const gaps: string[] = [];

    // Check files (current)
    if (fs.existsSync(path.join(this.tokenklawDir, 'SOUL.md'))) {
      evidence.push('Found: SOUL.md');
    }
    
    // Check runtime consumption (NEEDED)
    gaps.push('No proof of OpenClaw loading generated files');
    gaps.push('No known activation mechanism');
    gaps.push('No status reporting mechanism');

    return {
      valid: evidence.length > 0,
      runtimeConsumes: false,  // This is the key!
      evidence,
      gaps,
    };
  }
}
```

## Key Differences from ClaudeAdapter

| Aspect | Claude | OpenClaw |
|--------|--------|----------|
| Files generated | ✅ | ✅ |
| detect() | ✅ Works | Simple check |
| install() | ✅ Works | ✅ Works |
| activate() | ✅ Works | ❌ UNKNOWN |
| registerHooks() | ✅ Works | ❌ UNKNOWN |
| status() | ✅ Works | ❌ UNKNOWN |
| validate() | ✅ Consumes | ❌ Files only |

## Implementation Blockers

1. **No known installation path** - Need to find where OpenClaw is installed
2. **No known config format** - Need to understand OpenClaw's config
3. **No known plugin system** - Need to understand OpenClaw's plugin model
4. **No known activation** - Need to understand how to activate

## Questions to Resolve

Before implementing, need answers from OpenClaw documentation or source:

1. What's the config directory?
2. What file formats does it support?
3. Does it have a plugin/extension system?
4. Does it have command support?
5. Does it have hooks?
6. Does it have status reporting?

## Recommendation

**Do not implement OpenClawAdapter until**:
1. Someone provides the OpenClaw documentation
2. OR someone analyzes the source code
3. OR consumption is proven through testing

The "Scaffolded" status is accurate - files are written but nothing is proven to work.

## Current Status

OpenClaw: **Scaffolded** (files exist, consumption unproven)

This is the correct classification based on evidence:</tokenklaw: