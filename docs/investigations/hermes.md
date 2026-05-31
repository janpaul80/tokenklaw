# Hermes Integration Investigation

**Status**: Implementation Ready  
**Last Updated**: 2026-05-31  
**Investigator**: Claude Code (TokenKlaw)

## Executive Summary

Hermes is an active target runtime with existing TokenKlaw adapter scaffolding. Integration points are defined in `packages/core/src/activation.ts`.

## Architecture (From Code Analysis)

### Config Location

- **Primary**: `~/.hermes` (Windows) or `~/.config/hermes` (Linux/macOS)
- **TokenKlaw target**: `.hermes/tokenklaw/`

### Current Install Artifacts

The HermesInstaller generates:

```
~/.hermes/tokenklaw/
  startup-context.md         # System prompt compression, agent memory compression
  middleware.memory-compression.md  # Long-lived session memory compression
```

### Integration Points

| Point | Current | Possibility |
|-------|---------|------------|
| Config dir | `.hermes` | Write to this location |
| Startup context | `startup-context.md` | TokenKlaw compression rules |
| Memory | `middleware.memory-compression.md` | Session memory optimization |
| Commands | Not implemented | Custom commands |
| Status | Not implemented | Status display |

### What's Already Implemented

From `packages/core/src/activation.ts`:

```typescript
case 'hermes':
  return isWin ? path.join(home, '.hermes') : path.join(home, '.config', 'hermes');
```

Installer generates two files:
- `startup-context.md` - system prompt compression, agent memory compression, context dedupe hooks
- `middleware.memory-compression.md` - Apply compression to long-lived session memory while preserving code and command fidelity

### Opportunities for Deeper Integration

1. **Startup flow**: 
   - Hermes has startup context - inject TokenKlaw there
   - Add token budget rules at initialization

2. **Memory injection**:
   - Enhanced memory compression rules
   - Session-aware context retention
   - Code fidelity preservation during compression

3. **Command system** (if supported):
   - `/tokenklaw` → activates
   - `/tokenklaw-off` → deactivates

4. **Activation state**:
   - Path: `~/.hermes/tokenklaw/activation-state.json`
   - Track enabled/disabled per session

5. **Runtime state**:
   - Status display if Hermes supports it
   - Memory usage reporting

## Implementation-Ready Adapter Specification

### Priority Integration Points

1. **Startup hook**:
   - File: `~/.hermes/tokenklaw/startup.md`
   - Inject: Token budget, context reduction rules
   - Timing: On Hermes startup

2. **Memory optimization**:
   - File: `~/.hermes/tokenklaw/memory-rules.md`
   - Content: Retention rules, compression levels

3. **Activation state**:
   - File: `~/.hermes/tokenklaw/activation-state.json`
   - Schema: `{ enabled: boolean, mode: string, timestamp: number }`

4. **Commands** (if supported):
   - Generate `.md` command files for activation

5. **Status** (if supported):
   - Inject status indicator when active

### Hermes-Specific Optimization Opportunities

- **Long-lived sessions**: Hermes may keep sessions alive longer - memory compression is key
- **Context reduction**: System prompt compression already targeted
- **Agent memory**: TokenKlaw can provide memory optimization rules
- **Session recovery**: If Hermes supports session recovery, TokenKlaw state can persist

### Files to Create for TokenKlaw Integration

```
~/.hermes/tokenklaw/
  activation-state.json    # Active/inactive state
  memory-rules.md     # Memory retention and compression rules
  startup.md         # Startup injection rules
  commands/          # Custom commands (if supported)
  middleware/       # Additional middleware
```

## Current Status

**Stage**: Implementation ready - adapters scaffolded, needs real-runtime validation

**Next Action**: Test install in actual Hermes environment

**Blockers**: None identified - architecture is clear

## Link to Code

See `packages/core/src/activation.ts` lines 1099-1126 for current implementation.