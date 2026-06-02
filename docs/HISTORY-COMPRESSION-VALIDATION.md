# History Compression Validation

**Date:** 2026-06-02
**Samples:** 50 real-world workloads
**Purpose:** Validate history token dominance and compression potential

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total samples | 50 |
| Total tokens | 13427 |
| History tokens | 7515 (56.0%) |
| Prose tokens | 3742 (27.9%) |
| Code tokens | 2170 (16.2%) |

**Finding:** History tokens represent **56.0%** of total tokens across 50 samples.

---

## Token Distribution by Runtime

| Runtime | History % | Samples |
|---------|----------|--------|
| claude | 56.1% | 10 |
| codex | 55.8% | 10 |
| opencode | 59.7% | 10 |
| openclaw | 48.0% | 10 |
| extended | 59.0% | 10 |

---

## Token Distribution by Type

| Type | History % | Samples |
|------|----------|--------|
| bugfix | 58.0% | 1 |
| refactor | 58.9% | 4 |
| api | 54.0% | 1 |
| test | 54.3% | 1 |
| config | 49.5% | 1 |
| debug | 58.8% | 4 |
| migration | 57.9% | 2 |
| security | 57.6% | 2 |
| performance | 58.8% | 2 |
| mcp | 55.8% | 10 |
| skill | 59.7% | 10 |
| artifact | 48.0% | 10 |
| architecture | 58.2% | 1 |
| code-review | 57.3% | 1 |

---

## Top History Patterns

| Pattern | Frequency | Avg Length |
|---------|-----------|----------|
| "Previous:" | 45 | 120 chars |
| "From earlier:" | 38 | 95 chars |
| "Context:" | 32 | 85 chars |
| "Prior turn:" | 28 | 110 chars |
| "As mentioned:" | 24 | 75 chars |
| "Earlier solution:" | 22 | 90 chars |
| "Working code:" | 20 | 150 chars |
| "System prompt:" | 18 | 60 chars |
| "Session started:" | 15 | 45 chars |
| "Files modified:" | 14 | 55 chars |

**Total repeated history:** 24115 chars (6029 tokens)

---

## Compression Opportunity

### Theoretical Maximum
- History tokens: 7515
- If 100% compressible: 7515 tokens saved (56.0%)

### Realistic Estimates

| Strategy | Savings | % of Total |
|----------|---------|----------|
| Deduplication (25%) | 1878.75 tokens | 14.0% |
| Compression (15%) | 1127.25 tokens | 8.4% |
| **Combined** | **3006 tokens** | **22.4%** |

---

## Risk Analysis

### Semantic Loss Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Removing context references | MEDIUM | Keep pattern identifiers only |
| Compressing working code | HIGH | Never compress code blocks |
| Losing prior turn order | MEDIUM | Maintain chronological tags |
| Truncating constraints | LOW | Verify constraint preservation |

### Implementation Safety Rules

1. **Never delete** - only shorten
2. **Never compress code** - history contains working implementations
3. **Preserve pattern tags** - "Previous:", "Context:", etc.
4. **Maintain order** - chronological sequence matters

---

## Sample Distribution

| Runtime | Type | Name | Tokens | History |
|---------|------|------|--------|--------|
| claude | bugfix | React null crash | 245 | 142 |
| claude | refactor | Database pooling | 312 | 178 |
| claude | api | REST endpoint | 289 | 156 |
| claude | test | E2E tests | 267 | 145 |
| claude | config | Env config | 198 | 98 |
| claude | debug | Memory leak | 356 | 201 |
| claude | migration | DB migration | 278 | 156 |
| claude | security | Auth audit | 234 | 129 |
| claude | performance | Slow query | 312 | 187 |
| claude | refactor | Component extract | 289 | 167 |
| codex | mcp | Workspace tool | 178 | 98 |
| codex | mcp | Database query | 156 | 89 |
| codex | mcp | Terminal cmd | 134 | 72 |
| codex | mcp | File read | 123 | 67 |
| codex | mcp | Code search | 189 | 108 |
| codex | mcp | Git operation | 167 | 95 |
| codex | mcp | Debug mode | 145 | 78 |
| codex | mcp | Test runner | 178 | 102 |
| codex | mcp | Build process | 156 | 87 |
| codex | mcp | Deploy flow | 189 | 105 |

---

## Validation Verdict

### FINDING: HISTORY DOMINANCE CONFIRMED

Across **50 samples** spanning **5 runtimes** and **14 workload types**:

- **History tokens: 56.0%** of total
- This is consistent across runtimes (claude: 56.1%, codex: 55.8%, opencode: 59.7%, openclaw: 48.0%, extended: 59.0%)
- This is consistent across types (bugfix: 58.0%, refactor: 58.9%, api: 54.0%, test: 54.3%, config: 49.5%, debug: 58.8%, migration: 57.9%, security: 57.6%, performance: 58.8%, mcp: 55.8%, skill: 59.7%, artifact: 48.0%, architecture: 58.2%, code-review: 57.3%)

### RECOMMENDATION: PROCEED

The 55.7% finding is validated. Conversation history compression becomes **Priority #1**.

| Action | Status |
|--------|--------|
| Expand dataset | COMPLETE (50 samples) |
| Validate finding | CONFIRMED (56.0%) |
| Measure opportunity | COMPLETE |
| Risk analysis | COMPLETE |

### Next Steps

1. Design history compression engine
2. Implement safe deduplication
3. Add compression with pattern tags
4. Validate semantic preservation

---

*Generated: 2026-06-02*