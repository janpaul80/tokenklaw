# Token Hotspots Analysis

**Date:** 2026-06-02

---

## Token Counts by Category (Actual)

| Category | Tokens | % of Total |
|----------|--------|-----------|
| Prose | 307 | 27.3% |
| Code | 193 | 17.2% |
| History | 627 | 55.7% |
| Import | 0 | 0.0% |
| Trace | 0 | 0.0% |

---

## Per-Runtime Breakdown

| Runtime | Total | Code | Prose | History | Import | Trace |
|---------|-------|------|------|--------|---------|-------|
| Claude Code Session | 387 | 120 | 45 | 223 | 0 | 0 |
| Codex MCP Session | 221 | 0 | 99 | 124 | 0 | 0 |
| OpenCode Session | 238 | 0 | 94 | 146 | 0 | 0 |
| OpenClaw Session | 279 | 73 | 69 | 134 | 0 | 0 |

---

## Top 20 Repeated Blocks

| # | Text | Count | Chars | Source |
|---|------|-------|-------|-------|
1 | "const record = rateLimit.get(email) || { attempts: 0, locked..." | 2 | 148 | Claude Code Session

**Total repeated:** 148 chars (37 tokens)

---

## Hotspot Summary

### Largest Categories (by tokens)

1. **Prose: 27.3%**
   - Requirement explanations
   - Context descriptions
   - Constraint specification

2. **History: 55.7%**
   - Previous turn summaries
   - "From earlier in session"
   - "Previous working code"

3. **Code: 17.2%**
   - Function definitions
   - Interfaces
   - Implementations

### Repeated Content Sources

1. **Conversation history** - "Previous turns:", "From system prompt:", "Context from prior turns"
2. **Interface patterns** - Props extending React type definitions
3. **Import statements** - React, react-router-dom, etc.
4. **Styling patterns** - CSS-in-JS, className patterns

---

## Recommendations

| Priority | Hotspot | Strategy | Evidence |
|----------|--------|----------|----------|
| 1 | History (627 tokens) | Conversation compression | 25.4% of tokens |
| 2 | Repeated code patterns | Pattern deduplication | 1 blocks found |
| 3 | Import statements | Import compression | 0 tokens |
| 4 | Interface boilerplate | Template compression | Repeated Props |

---

*Generated: 2026-06-02*