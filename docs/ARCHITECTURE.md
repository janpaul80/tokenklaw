# TokenKlaw Adapter Architecture

## Current Architecture

### CLI Flow (Today)
```
CLI (apps/cli)
  ↓
installActivationArtifacts(agent, options)
  ↓
RuntimeInstaller (BaseRuntimeInstaller)
  ↓
Build Artifacts (.md, .json files)
  ↓
Write to ~/.runtime/tokenklaw/
```

### Current Components

| Component | Location | Purpose |
|-----------|----------|---------|
| CLI | apps/cli/src/index.ts | Entry point |
| installActivationArtifacts | packages/core/src/activation.ts:1184 | Main install function |
| BaseRuntimeInstaller | packages/core/src/activation.ts:490 | Abstract installer class |
| RuntimeInstaller | packages/core/src/activation.ts:76 | Interface |
| Installer Registry | packages/core/src/activation.ts:1172-1170 | AgentId → Installer mapping |

## Future Architecture (With Adapter)

### Target Flow
```
CLI
  ↓
RuntimeAdapter (detects, installs, activates, validates)
  ↓
RuntimeInstaller (builds artifacts)
  ↓
Write to ~/.runtime/tokenklaw/
```

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| RuntimeAdapter | packages/core/src/adapter.ts | Interface contract |
| AdapterRegistry | packages/core/src/adapter.ts | Maps AgentId → Adapter |
| RuntimeAdapterCapabilities | packages/core/src/adapter.ts | Capability flags |

## Integration Design

### Current Install Flow (activation.ts)

```typescript
// From CLI:
// tokenklaw install openclaw

// Calls:
installActivationArtifacts('openclaw', { dryRun: false })

// resolveInstallTarget():
getInstaller('openclaw').buildTarget()

// getInstaller() returns:
// new OpenClawInstaller() extending BaseRuntimeInstaller

// Writes files to ~/.openclaw/tokenklaw/
```

### Future Install Flow (with Adapter)

```typescript
// CLI:
// tokenklaw install openclaw

// Step 1: Detect runtime
const adapter = createAdapter('openclaw');
const detected = await adapter.detect(); // Returns boolean

// Step 2: Install (delegate to existing installer)
const result = await adapter.install({ dryRun: false });

// Step 3: Activate (new functionality)
const active = await adapter.activate('on');

// Step 4: Validate consumption
const validation = await adapter.validate();
```

### Integration Point

The key change is:

```
Current:     CLI → RuntimeInstaller
Future:     CLI → RuntimeAdapter → RuntimeInstaller
```

The RuntimeAdapter wraps RuntimeInstaller and adds:
1. `detect()` - Check if runtime exists
2. `activate()` - Set activation state  
3. `validate()` - Verify files are consumed
4. `status()` - Report state
5. `registerHooks()` - Register runtime hooks

## Migration Plan

### Phase 1: Reference Adapter (Claude)
- Create ClaudeAdapter implementing RuntimeAdapter
- Use existing ClaudePluginInstaller internally
- Validate the interface

### Phase 2: Extend Other Adapters
- Implement OpenClawAdapter, HermesAdapter, etc.
- Each delegates to existing installer
- Each adds detect/validate methods

### Phase 3: Integrate with CLI
- Modify CLI to use adapter flow
- Add `--detect` flag
- Add `--validate` flag
- Keep backward compatibility

## Implementation Choices

### Option A: Adapter Wraps Installer
```typescript
class ClaudeAdapter implements RuntimeAdapter {
  private installer = new ClaudePluginInstaller();

  async install(options) {
    // Use existing installer
    const target = this.installer.buildTarget();
    // ... write files
    return { success: true };
  }

  async detect() {
    // New: detect Claude Code
    return fs.existsSync(claudeDir);
  }
}
```

### Option B: Installer Implements Adapter (Recommended)
```typescript
class ClaudePluginInstaller extends BaseRuntimeInstaller implements RuntimeAdapter {
  async detect() { /* ... */ }
  async activate() { /* ... */ }
  async validate() { /* ... */ }
}
```

## Recommendation

1. **Use Option B** - Installer already knows the runtime
2. **Start with Claude** - Already validated, good reference
3. **Add adapter methods to existing installers** - Not rewrite

## Gap Analysis

| Runtime | Installer | Adapter Ready |
|---------|-----------|-------------|
| Claude | Yes (ClaudePluginInstaller) | Add adapter methods |
| OpenClaw | Yes (OpenClawInstaller) | Add adapter methods |
| Hermes | Yes (HermesInstaller) | Add adapter methods |
| Others | Yes | Add adapter methods |
| New runtimes | Use base | Implement from scratch |

## Key Files

| File | Purpose |
|------|---------|
| packages/core/src/activation.ts | RuntimeInstaller (current) |
| packages/core/src/adapter.ts | RuntimeAdapter contract (new) |

## Recommended First Implementation

Claude Code as the reference adapter:

1. Add `detect()` - Check `~/.claude/` exists
2. Add `activate()` - Write state to `~/.claude/tokenklaw/state.json`
3. Add `validate()` - Check config/settings.json
4. Add `status()` - Read state file
5. Test with CLI