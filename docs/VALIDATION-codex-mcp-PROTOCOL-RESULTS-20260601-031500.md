# Codex MCP Protocol Validation — Results

Timestamp: 2026-06-01T03:15:00Z

## Summary

TokenKlaw MCP server protocol validated via direct JSON-RPC testing. Full Codex runtime invocation requires API credentials and model calls.

---

## MCP Server Registration

```bash
codex mcp add tokenklaw -- node tokenklaw-mcp-server.js
# → Added global MCP server 'tokenklaw'
```

Registration verified:
```bash
codex mcp list
# → tokenklaw ... enabled
```

---

## Protocol Validation (Direct JSON-RPC)

### 1. Initialize

**Request:**
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05"}}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {"tools": {}},
    "serverInfo": {"name": "tokenklaw-mcp", "version": "1.0.0"}
  }
}
```

✅ Initialize successful

---

### 2. Tools List

**Request:**
```json
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {"name": "tokenklaw_activate", "description": "Activate TokenKlaw token-saving mode"},
      {"name": "tokenklaw_deactivate", "description": "Deactivate TokenKlaw"},
      {"name": "tokenklaw_status", "description": "Get TokenKlaw activation status"}
    ]
  }
}
```

✅ Tool enumeration successful — 3 tools available

---

### 3. Tool Call (tokenklaw_activate)

**Request:**
```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"tokenklaw_activate","arguments":{}}}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [{
      "type": "text",
      "text": "TokenKlaw active.\nContext reduction: on\nDuplicate detection: on\nCache guidance: on\nVerbose replies: reduced\nToken-saving mode: enabled"
    }]
  }
}
```

✅ Tool invocation successful — expected response returned

---

## Limitation

This validation tested the MCP protocol via direct JSON-RPC communication.

**What was NOT tested:**
- Codex runtime session connecting to MCP server
- Model-level tool invocation via Codex
- API/credential-based authentication

**Required for full Validation:**
1. Codex starts with registered MCP server
2. Codex runtime lists TokenKlaw MCP tools
3. Codex model invokes TokenKlaw tool through runtime

This requires Codex credentials and API access, which cannot be tested without user authorization.

---

## Current Status

**Codex: Scaffolded / MCP protocol validated**

- MCP server created: ✅
- MCP server registered: ✅
- Protocol communication: ✅
- Tool enumeration: ✅
- Tool invocation: ✅
- Full runtime invocation: ⚠️ Requires credentials/API

---

## Evidence References

- Commit: `b2292fd` — MCP registration proof
- Commit: `cff907a` — Landing page update

---

*Protocol validation by: Claude Code*