# OpenClaw Integration Investigation

**Status**: Implementation Ready  
**Last Updated**: 2026-05-31  
**Investigator**: Claude Code (TokenKlaw)

## Executive Summary

OpenClaw is an active target runtime with existing TokenKlaw adapter scaffolding. Integration points are defined in `packages/core/src/activation.ts`.

## Architecture (From Code Analysis)

### Config Location

- **Primary**: `~/.openclaw` (Windows) or `~/.config/openclaw` (Linux/macOS)
- **TokenKlaw target**: `.openclaw/tokenklaw/`

### Current Install Artifacts

The OpenClawInstaller generates:

```
~/.openclaw/tokenklaw/
  SOUL.md                         # Compact operational memory
  middleware.token-compression.md  # Compression layer pipeline
```

### Integration Points

| Point | Current | Possibility |
|-------|---------|------------|
| Config dir | `.openclaw` | Write to this location |
| Memory system | `SOUL.md` | TokenKlaw token rules |
| Middleware | `middleware.*.md` | Compression hooks |
| Startup | Not implemented | startup-context.md |
| Commands | Not implemented | Custom command files |
| Status | Not implemented | Status indicator |

### What's Already Implemented

From `packages/core/src/activation.ts`:

```typescript
case 'openclaw':
  return isWin ? path.join(home, '.openclaw') : path.join(home, '.config', 'openclaw');
```

Installer generates two files:
- `SOUL.md` - dedupe repetitive context, compress system prompt overlays
- `middleware.token-compression.md` - context dedupe, stack-trace compression, prompt budget optimization

### Opportunities for Deeper Integration

1. **Startup hook**: Add `startup.md` or modify initialization flow
2. **Command system**: If OpenClaw supports markdown commands, generate `/tokenklaw` style commands
3. **Memory optimization**: Enhanced SOUL with session-specific compression rules
4. **Status badge**: If OpenClaw has status display, inject `[TOKENKLAW]` indicator
5. **Middleware pipeline**: Extend compression layers with deduplication rules
6. **Runtime state**: Write activation state to `.openclaw/tokenklaw/state.json`

### Files to Create/Modify for TokenKlaw Integration

```
~/.openclaw/tokenklaw/
  activation-state.json       # Active/inactive state
  commands/                  # Custom commands (if supported)
  middleware/
    context-dedupe.md       # Context deduplication rules
    response-compression.md # Response compression
```

## Implementation-Ready Adapter Specification

### Priority Integration Points

1. **Activation state file**:
   - Path: `~/.openclaw/tokenklaw/activation-state.json`
   - Schema: `{ enabled: boolean, mode: string, timestamp: number }`

2. **Memory injection**:
   - Path: `~/.openclaw/tokenklaw/memory-optimization.md`
   - Content: Token budget rules, context dedupe, verbosity shaping

3. **Startup flow**:
   - Check for `~/.openclaw/tokenklaw/startup.md`
   - Inject TokenKlaw memory on OpenClaw startup

4. **Middleware**:
   - Extend compression pipeline with TokenKlaw-specific rules
   - Path: `~/.openclaw/tokenklaw/middleware/`

### Command Support

If OpenClaw supports .md command files:
- Generate `/tokenklaw` command → activates TokenKlaw
- Generate `/tk` command → alias
- Generate `/tokenklaw-off` command → deactivates

### Status Opportunities

- If OpenClaw has statusline: Inject `[TOKENKLAW]` when active
- If OpenClaw has state display: Show enabled/disabled indicator

## Current Status

**Stage**: Implementation ready - adapters scaffolded, needs real-runtime validation

**Next Action**: Test install in actual OpenClaw environment

**Blockers**: None identified - architecture is clear

## Link to Code

See `packages/core/src/activation.ts` lines 1066-1097 for current implementation.