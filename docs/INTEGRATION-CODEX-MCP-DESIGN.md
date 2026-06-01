# Codex Integration Design — MCP Path

Timestamp: 2026-06-01T02:15:00Z

## Discovery Summary

Codex offers three primary integration mechanisms:
1. **MCP (Model Context Protocol)** servers for tool/capability injection
2. **Plugin marketplace** for extendable plugins
3. **Config overrides** via TOML in `~/.codex/config.toml`

## Integration Path: MCP (Recommended)

### Why MCP?
- TokenKlaw can run as an MCP server providing activation/deactivation commands
- MCP is a standard protocol (JSON-RPC over stdio)
- Works with other MCP clients (Claude Desktop, VS Code, etc.)

### MCP commands available in Codex:
```
codex mcp list    # List MCP servers
codex mcp add    # Add MCP server
codex mcp remove # Remove MCP server
codex mcp auth   # OAuth for MCP servers
```

### Implementation: TokenKlaw MCP Server

Create a simple MCP server that exposes TokenKlaw commands:

```typescript
// tokenklaw-mcp-server.ts
import { McpServer } from '@modelcontextprotocol/server'

const server = new McpServer({
  name: 'TokenKlaw',
  version: '1.0.0'
}, {
  tools: {
    tokenklaw_activate: {
      description: 'Activate TokenKlaw token-saving mode',
      parameters: {}
    },
    tokenklaw_deactivate: {
      description: 'Deactivate TokenKlaw',
      parameters: {}
    },
    tokenklaw_status: {
      description: 'Get TokenKlaw activation status',
      parameters: {}
    }
  }
})

server.run()
```

### Register with Codex:
```bash
codex mcp add tokenklaw --type local --command ["node", "tokenklaw-mcp-server.js"]
```

---

## Alternative Path: Config Injection (Lower Effort)

### Codex config file:
`~/.codex/config.toml` (TOML format)

### Config override via CLI:
```bash
codex -c tokenklaw.enabled=true
```

### Would require:
- Understanding full TOML config schema
- No public schema URL found (redirects to marketing page)

---

## Alternative Path: Plugin

### Plugin commands:
```
codex plugin marketplace
```

### Implementation:
- Would require plugin package in Codex marketplace
- Higher effort than MCP

---

## Recommended: MCP Path First

### Phase 1: Basic MCP Server (Next sprint)
1. Create Node.js MCP server exposing tokenklaw_* tools
2. Document `codex mcp add` registration
3. Test with Codex CLI

### Phase 2: Full Integration
- Add activation state management to MCP server
- Connect to TokenKlaw's existing state files

### Phase 3: Distribution
- Publish as npm package `@tokenklaw/codex-mcp`
- Support Codex plugin marketplace

---

## Evidence Sources

- Command: `codex mcp --help` — Full MCP subcommand list
- Command: `codex plugin --help` — Plugin management
- Command: `codex -c --help` — Config override syntax

---

*Prepared by: Claude Code (integration design)*