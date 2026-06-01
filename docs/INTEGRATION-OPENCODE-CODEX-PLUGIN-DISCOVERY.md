# Integration Discovery — OpenCode & Codex Plugin Systems

Timestamp: 2026-06-01T01:30:00Z

This document records the plugin and integration mechanism discovery for OpenCode and Codex runtimes.

---

## OpenCode Integration Points

### `opencode plugin`
```
opencode plugin <module> [-g|--global] [-f|--force]
```
- Installs npm modules as OpenCode plugins
- Could potentially wrap TokenKlaw as an npm package

### `opencode providers`
```
opencode providers list
opencode providers login [url]
opencode providers logout
```
- Manages AI provider configurations
- Could configure TokenKlaw middleware as a custom provider

### `opencode db`
- Database tools for session data
- Not directly relevant for TokenKlaw integration

---

## Codex Integration Points

### `codex plugin marketplace`
- Manages Codex plugins
- Plugin marketplace system available

### `codex mcp`
```
codex mcp list|get|add|remove|login|logout
```
- Model Context Protocol server management
- Could integrate TokenKlaw as an MCP server

### `-c, --config <key=value>`
- Runtime config overrides via TOML syntax
- Example: `-c model="o3"`
- Could potentially override rules/skills paths via config

---

## Next Integration Steps

### OpenCode
1. Package TokenKlaw as an npm module
2. Use `opencode plugin <module>` to install
3. Or inject TokenKlaw rules via config file (if supported)

### Codex
1. Use MCP via `codex mcp add` to register TokenKlaw as a server
2. Or use `-c` config to override skill paths
3. Investigate `~/.codex/config.toml` schema

---

## Status

OpenCode: **Investigation → Integration Path Identified**
Codex: **Investigation → Integration Path Identified**

---

*Prepared by: Claude Code (integration discovery)*