# OpenCode Integration Design — Skills Path

Timestamp: 2026-06-01T02:00:00Z

## Discovery Summary

OpenCode's skill system auto-discovers SKILL.md files from multiple paths, including TokenKlaw's own skill directory:
- `~/.claude/skills/<name>/SKILL.md` (auto-loaded)
- `~/.agents/skills/<name>/SKILL.md` (auto-loaded)
- `.opencode/skills/` (project-scoped)
- `~/.config/opencode/skills/` (global)

## Integration Path: Skills (Lowest Effort ✅)

### Why this path?
1. TokenKlaw artifacts already include `SKILL.md` format
2. No npm package creation required
3. No code changes needed — only file placement
4. Works with existing TokenKlaw skill structure

### Implementation Steps

1. Generate TokenKlaw skill in OpenCode-compatible SKILL.md format:
   ```markdown
   ---
   name: tokenklaw
   description: TokenKlaw activation — use when user wants to activate token-saving mode, check status, or manage activation.
   ---
   
   # TokenKlaw
   
   TokenKlaw provides token-optimization for coding agents...
   ```

2. Place skill file:
   - Option A: Add to OpenCode skill paths via config
   - Option B: Use already auto-discovered paths (`~/.claude/skills/tokenklaw/SKILL.md`)

3. Verify via:
   ```bash
   opencode debug skill  # Lists all loaded skills
   ```

---

## Alternative Path: Plugin (Medium Effort)

### Plugin hook surface:
- `config(cfg)`: Modify config on init
- `tool.execute.before/after`: Intercept tool execution
- `chat.message`, `chat.params`: Transform messages
- `permission.ask`: Custom permission logic
- `experimental.*`: Session compaction hooks

### Implementation would require:
- Node.js plugin package `@tokenklaw/opencode-plugin`
- TypeScript code with Plugin interface

---

## Alternative Path: MCP Server (Higher Effort)

### MCP config:
```json
"mcp": {
  "tokenklaw": {
    "type": "local",
    "command": ["node", "./tokenklaw-mcp-server.js"],
    "enabled": true
  }
}
```

### Implementation would require:
- MCP server implementation (JSON-RPC)
- Node.js server script

---

## Recommended: Skills Path First

### Phase 1: SKILL.md Integration (Next sprint)
1. Ensure TokenKlaw skill files are in SKILL.md format
2. Add path to OpenCode config OR leverage auto-discovery
3. Test with `opencode debug skill`

### Phase 2: Plugin (If hooks needed)
- Create @tokenklaw/opencode-plugin for deeper integration

### Phase 3: MCP (If tool execution interception needed)
- Create tokenklaw MCP server for real-time control

---

## Evidence Sources

- Command: `opencode debug skill` — Full skill/agent/config schema (700+ lines)
- Auto-discovery paths confirmed from OpenCode CLI
- Plugin hook interface documented in skill output

---

*Prepared by: Claude Code (integration design)*