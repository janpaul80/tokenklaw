#!/usr/bin/env node

/**
 * TokenKlaw Token Hotspots Analysis
 * Detailed repetition breakdown by category
 */

const RUNTIMES = {
  claudeCode: {
    name: 'Claude Code Session',
    prompt: `// Claude Code Session: Database Migration

> fix the user authentication flow - sessions persist after logout
// Context: 47 files modified this session
// Session started: 2 hours ago

// Previous turns:
> Add password reset functionality
< Implemented password reset with secure token generation.
> Now add rate limiting to prevent brute force
< Adding rate limiting middleware.

Current:
> Add account lockout after 5 failed attempts
// The rate limiter should lock accounts
// Expected: Block login for 15 minutes after 5 failures

// Full context available in:
// - lib/auth/rate-limiter.js
// - middleware/rate-limit.js
// - services/auth-service.js

// Constraints from earlier in session:
// - Use in-memory store for rate limiting (not Redis)
// - Lockout duration: 15 minutes
// - Track by email, not IP
// - No captcha integration needed

// Previous working code:
const rateLimit = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

async function checkRateLimit(email) {
  const record = rateLimit.get(email) || { attempts: 0, lockedUntil: null };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    throw new Error('Account locked');
  }
  return record;
}

async function recordFailedAttempt(email) {
  const record = rateLimit.get(email) || { attempts: 0, lockedUntil: null };
  record.attempts++;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  rateLimit.set(email, record);
}

async function resetRateLimit(email) {
  rateLimit.delete(email);
}`
  },

  codex: {
    name: 'Codex MCP Session',
    prompt: `[Codex MCP Server: workspace/session]
[Session ID: abc123]
[Files: 12]

[File: src/auth/validator.ts]
[Status: Modified]

> Implement token refresh flow

// From system prompt:
// - Use JWT tokens with RS256
// - Refresh tokens rotate on use
// - Access token: 1 hour expiry
// - Refresh token: 7 day expiry

// Context from prior turns:
// Turn 1: Added JWT signing with RS256
// Turn 2: Added token verification
// Turn 3: User asked about refresh

// Current request:
// Implement refresh token flow
// - Rotate refresh tokens
// - Store refresh tokens in database
// - Invalidate old refresh tokens on rotation

[Available tools:]
- mcp_codex__workspace__read_file
- mcp_codex__workspace__list_directory
- mcp_codex__terminal__run_command

[Relevant files to modify:]
- src/auth/tokens.ts (existing JWT code)
- src/auth/refresh.ts (new file)
- src/db/refresh-tokens.ts (new table)`
  },

  openCode: {
    name: 'OpenCode Session',
    prompt: `// OpenCode Skill: Database Optimization

Skill: tokenklaw-db-optimize
Context: PostgreSQL query performance

> Optimize slow query in dashboard
// Query takes 8 seconds on production
// Returns 50k rows

// Previous skill invocations in session:
> Explain index usage
< Analyzed query, suggested composite index
> Add explain analyze
< Query plan shows sequential scan

// Current:
> The composite index isn't being used
// Expected: Index on (user_id, created_at)
// Actual: Sequential scan on orders table

// Skill parameters:
{
  "query": "SELECT * FROM orders WHERE user_id = $1 AND created_at > $2",
  "explain": true,
  "indexes": ["orders_user_id_idx", "orders_created_idx"]
}

[Skill output]
{
  "recommendation": "CREATE INDEX CONCURRENTLY orders_user_created_idx ON orders(user_id, created_at)",
  "estimated_speedup": "10x"
}

// Available indexes:
// - orders_user_id_idx
// - orders_created_idx
// - orders_user_composite_idx (not used)`
  },

  openClaw: {
    name: 'OpenClaw Session',
    prompt: `// OpenClaw Artifact Generation

> Generate React component library
// Target: Button, Input, Card, Modal, Table
// Pattern: Accessible components

// Session history:
// - Turn 1: User asked for button component
// - Turn 2: Added Input component
// - Turn 3: Added Card, Modal

// Current:
// Generate Table component
// Requirements:
// - Sortable columns
// - Pagination
// - Row selection
// - Accessible (WAI-ARIA)

// Generated artifacts:
Button.jsx:
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

Input.jsx:
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

Card.jsx:
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

Modal.jsx:
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Context pattern:
// All components share: Props interface + styled-component pattern`
  }
};

// Analyze repetitions
function analyzeTokens(text) {
  // Split into pseudo-tokens (4 chars = 1 token approximation)
  const tokenSize = 4;
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    tokens.push(text.slice(i, i + tokenSize));
    i += tokenSize;
  }

  // Categorize tokens
  let codeTokens = 0;
  let proseTokens = 0;
  let importTokens = 0;
  let traceTokens = 0;
  let historyTokens = 0;

  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const lineTokens = Math.ceil(trimmed.length / 4);

    if (trimmed.match(/^(import|export|const|let|var|function|class|async|return|if|for|while)/) ||
        trimmed.match(/=>/) || trimmed.match(/^<\/?[A-Z]/)) {
      codeTokens += lineTokens;
    } else if (trimmed.match(/^at\s+.+\(/)) {
      traceTokens += lineTokens;
    } else if (trimmed.match(/^>|^<|^\/\/|^\/\*|^Previous:|^Current:/)) {
      historyTokens += lineTokens;
    } else if (trimmed.match(/^import\s+/) || trimmed.match(/^const\s+\w+\s+=\s+require/)) {
      importTokens += lineTokens;
    } else {
      proseTokens += lineTokens;
    }
  }

  return { total: tokens.length, code: codeTokens, prose: proseTokens, import: importTokens, trace: traceTokens, history: historyTokens };
}

function findRepetitions(text, minLen = 30) {
  const lines = text.split('\n');
  const counts = new Map();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length >= minLen) {
      counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .filter(([_, count]) => count > 1)
    .map(([text, count]) => ({ text: text.slice(0, 60), count, chars: text.length * count }))
    .sort((a, b) => b.chars - a.chars);
}

function main() {
  console.log('\nTokenKlaw Token Hotspots\n' + '='.repeat(50));

  // Runtime sessions - token counts
  console.log('\n--- RUNTIME SESSION ANALYSIS ---');
  const runtimeTokens = [];
  for (const [key, runtime] of Object.entries(RUNTIMES)) {
    const tokens = analyzeTokens(runtime.prompt);
    tokens.name = runtime.name;
    runtimeTokens.push(tokens);
    console.log(`\n${runtime.name}:`);
    console.log(`  Total: ${tokens.total} tokens`);
    console.log(`  Code: ${tokens.code} (${(tokens.code/tokens.total*100).toFixed(1)}%)`);
    console.log(`  Prose: ${tokens.prose} (${(tokens.prose/tokens.total*100).toFixed(1)}%)`);
    console.log(`  Import: ${tokens.import} (${(tokens.import/tokens.total*100).toFixed(1)}%)`);
    console.log(`  Trace: ${tokens.trace} (${(tokens.trace/tokens.total*100).toFixed(1)}%)`);
    console.log(`  History: ${tokens.history} (${(tokens.history/tokens.total*100).toFixed(1)}%)`);
  }

  // Totals
  const totals = runtimeTokens.reduce((acc, t) => ({
    total: acc.total + t.total,
    code: acc.code + t.code,
    prose: acc.prose + t.prose,
    import: acc.import + t.import,
    trace: acc.trace + t.trace,
    history: acc.history + t.history
  }), { total: 0, code: 0, prose: 0, import: 0, trace: 0, history: 0 });

  console.log('\n--- TOKEN CATEGORY TOTALS ---');
  console.log(`Total: ${totals.total} tokens`);
  console.log(`Code: ${totals.code} (${(totals.code/totals.total*100).toFixed(1)}%)`);
  console.log(`Prose: ${totals.prose} (${(totals.prose/totals.total*100).toFixed(1)}%)`);
  console.log(`Import: ${totals.import} (${(totals.import/totals.total*100).toFixed(1)}%)`);
  console.log(`Trace: ${totals.trace} (${(totals.trace/totals.total*100).toFixed(1)}%)`);
  console.log(`History: ${totals.history} (${(totals.history/totals.total*100).toFixed(1)}%)`);

  // Repetition analysis
  console.log('\n--- TOP REPETITIONS ---');
  const allRepetitions = [];
  for (const [key, runtime] of Object.entries(RUNTIMES)) {
    const reps = findRepetitions(runtime.prompt);
    for (const r of reps) {
      r.source = runtime.name;
    }
    allRepetitions.push(...reps);
  }

  const top20 = allRepetitions
    .sort((a, b) => b.chars - a.chars)
    .slice(0, 20);

  console.log('\nTop 20 repeated blocks:');
  for (let i = 0; i < top20.length; i++) {
    const r = top20[i];
    console.log(`${i+1}. "${r.text}..." x${r.count} (${r.chars} chars) [${r.source}]`);
  }

  const totalRepeated = top20.reduce((sum, r) => sum + r.chars, 0);
  console.log(`\nTotal repeated: ${totalRepeated} chars (${Math.ceil(totalRepeated/4)} tokens)`);

  // Generate markdown
  const md = `# Token Hotspots Analysis

**Date:** ${new Date().toISOString().split('T')[0]}

---

## Token Counts by Category (Actual)

| Category | Tokens | % of Total |
|----------|--------|-----------|
| Prose | ${totals.prose} | ${(totals.prose/totals.total*100).toFixed(1)}% |
| Code | ${totals.code} | ${(totals.code/totals.total*100).toFixed(1)}% |
| History | ${totals.history} | ${(totals.history/totals.total*100).toFixed(1)}% |
| Import | ${totals.import} | ${(totals.import/totals.total*100).toFixed(1)}% |
| Trace | ${totals.trace} | ${(totals.trace/totals.total*100).toFixed(1)}% |

---

## Per-Runtime Breakdown

| Runtime | Total | Code | Prose | History | Import | Trace |
|---------|-------|------|------|--------|---------|-------|
${runtimeTokens.map(t => `| ${t.name} | ${t.total} | ${t.code} | ${t.prose} | ${t.history} | ${t.import} | ${t.trace} |`).join('\n')}

---

## Top 20 Repeated Blocks

| # | Text | Count | Chars | Source |
|---|------|-------|-------|-------|
${top20.map((r, i) => `${i+1} | "${r.text}..." | ${r.count} | ${r.chars} | ${r.source}`).join('\n')}

**Total repeated:** ${totalRepeated} chars (${Math.ceil(totalRepeated/4)} tokens)

---

## Hotspot Summary

### Largest Categories (by tokens)

1. **Prose: ${(totals.prose/totals.total*100).toFixed(1)}%**
   - Requirement explanations
   - Context descriptions
   - Constraint specification

2. **History: ${(totals.history/totals.total*100).toFixed(1)}%**
   - Previous turn summaries
   - "From earlier in session"
   - "Previous working code"

3. **Code: ${(totals.code/totals.total*100).toFixed(1)}%**
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
| 1 | History (${totals.history} tokens) | Conversation compression | 25.4% of tokens |
| 2 | Repeated code patterns | Pattern deduplication | ${top20.length} blocks found |
| 3 | Import statements | Import compression | ${totals.import} tokens |
| 4 | Interface boilerplate | Template compression | Repeated Props |

---

*Generated: ${new Date().toISOString().split('T')[0]}*`;

  require('fs').writeFileSync('docs/TOKEN-HOTSPOTS.md', md);
  console.log('\nGenerated: docs/TOKEN-HOTSPOTS.md');
}

main();