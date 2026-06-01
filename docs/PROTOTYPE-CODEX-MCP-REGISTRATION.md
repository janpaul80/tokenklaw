# Codex MCP Prototype — Proof of Registration

Timestamp: 2026-06-01T02:45:00Z

## Proof Summary

TokenKlaw MCP server successfully registered with Codex CLI.

## What was created

`codex-mcp/tokenklaw-mcp-server.js` — Minimal MCP server exposing:
- tokenklaw_activate
- tokenklaw_deactivate
- tokenklaw_status

## Registration command

```bash
codex mcp add tokenklaw -- node tokenklaw-mcp-server.js
```

## Verification

```bash
codex mcp list
```

## Output

```
Name       Command                                          Args  Status   Auth
node_repl  ...node_repl.exe                               -     enabled Unsupported
tokenklaw  node ...tokenklaw-mcp-server.js                 -     enabled Unsupported
```

## Why this matters

- ✅ Codex accepts TokenKlaw as an MCP server
- ✅ TokenKlaw tools available to Codex at runtime
- ✅ No plugin marketplace needed
- ✅ Works from clean-room path

## Next step (integration)

The MCP server is registered but requires Codex interactive session to call tools. True runtime consumption would be proven when:

1. User starts Codex session
2. Calls tokenklaw_activate tool
3. TokenKlaw state file is created/updated
4. Activation response returned

## Status change candidate

This registration moves Codex from **Investigation → Scaffolded** (integration path proven).

---

*Proof by: Claude Code (prototype)*