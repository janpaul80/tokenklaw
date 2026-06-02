# Token Distribution Analysis

**Date:** 2026-06-02
**Purpose:** Identify where tokens are consumed to guide compression.

---

## Summary

| Category | Count | % Total |
|-----------|-------|--------|
| Code lines | 94 | 33.8% |
| Prose lines | 184 | 66.2% |
| Imports | 35 | - |
| Comments | 49 | - |
| Stack traces | 15 | - |
| Repeated content | 1396 chars | - |

---

## Per-Workload

| Workload | Tokens | Code | Prose | Imports | Repeated |
|---------|--------|------|------|--------|----------|
| Bug Fix | 245 | 11 | 9 | 4 | 0 |
| Code Refactor | 295 | 17 | 21 | 1 | 16 |
| Multi-File Edit | 309 | 5 | 37 | 4 | 55 |
| API Handler | 435 | 19 | 17 | 8 | 252 |
| Test File | 465 | 19 | 23 | 0 | 201 |
| Import Heavy | 501 | 16 | 24 | 18 | 612 |
| Config Files | 269 | 0 | 35 | 0 | 260 |
| Conversation History | 312 | 4 | 13 | 0 | 0 |
| Stack Trace | 354 | 3 | 5 | 0 | 0 |

---

## Where Tokens Are

### 1. Code (33.8%)
- Function definitions, imports, JSX, CSS
- **Target:** Code pattern deduplication

### 2. Prose (66.2%)
- Explanations, requirements, questions
- **Target:** Conversation summarization

### 3. Imports (35)
- Duplicate import statements
- **Target:** Import compression

### 4. Repeated Content (1396 chars)
- Boilerplate across files
- **Target:** Template deduplication

---

## Compression Priority

| Priority | Strategy | Potential |
|----------|----------|----------|
| 1 | Code pattern deduplication | HIGH |
| 2 | Import compression | MEDIUM |
| 3 | Template extraction | MEDIUM |
| 4 | Conversation compression | LOW |

---

*Generated: 2026-06-02*