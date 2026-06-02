# Phrase Normalization Validation

## Critical Finding: Semantic Drift Detected

The v1.3 benchmark gains are NOT real compression improvements. They are caused by **deleting semantic content**.

### History Benchmark Analysis

**Original prompt (189 chars → 135 chars = 28.6% "reduction"):**
```
// System: You are a helpful assistant
// Previous: User asked about JavaScript
function add(a, b) { return a + b; }
// System: Be concise
// Previous: User asked about Python
...
// System: Use TypeScript
// Previous: User asked about type safety
...
// System: Explain in comments
...
// System: Add error handling
...
// System: Use async
// Current: User asks for complete function
```

**Phrase replacements applied:**

| Rule | Applied To | Output | Semantic Loss |
|------|---------|--------|------------|
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: You are a helpful assistant` | `` | **CRITICAL** - removes persona |
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: Be concise` | `` | **CRITICAL** - removes constraint |
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: Use TypeScript` | `` | **CRITICAL** - removes language spec |
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: Explain in comments` | `` | **CRITICAL** - removes documentation style |
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: Add error handling` | '' | **CRITICAL** - removes robustness spec |
| `[/\/\/ System: [^\n]+\n/g, '']` | `// System: Use async` | `` | **CRITICAL** - removes async spec |
| `[/Previous:/g, 'Prev:']` | 4 occurrences | `Prev:` | LOW - no semantic loss |

**Total "gain": 189 chars**
- 168 chars from deleting system instructions
- 21 chars from `Previous:` → `Prev:`

**Verdict: 89% of "compression" is destructive semantics deletion.**

---

## Risk Analysis

### Semantic Drift Taxonomy

| Risk Level | Rule | Example | Impact |
|-----------|------|--------|--------|
| **CRITICAL** | `[/\/\/ System: [^\n]+\n/g` | Removes "Be concise" | Model loses constraint |
| **CRITICAL** | `[/\/\/ System: [^\n]+\n/g` | Removes "Use TypeScript" | Wrong language output |
| **HIGH** | `[/\/\/ System: [^\n]+\n/g` | Removes persona | Personality drift |
| **MEDIUM** | `/User asks about/` | → `User asked:` | Tense shift |
| **LOW** | `/Previous:/` | → `Prev:` | Minor readability loss |

### Root Cause

The `[/\/\/ System: [^\n]+\n/g, '']` rule was added to remove "redundant" system comments, but these comments carry **semantic weight** that the model interprets.

**This rule must be REMOVED.**

---

## Validation Results

### Before Fix (v1.3 - INVALID)

| Scenario | "Reduction" | Real Compression | Semantic Loss |
|----------|------------|--------------|-------------|
| Small | 23.3% | ~0% | ~59 chars |
| Medium | 10.4% | ~0% | 0 chars |
| Large | 23.3% | ~0% | ~246 chars |
| Multi-file | 12.7% | ~0% | ~141 chars |
| History | 28.6% | ~21 chars | **168 chars deleted** |

### After Removing Destructive Rules

The following rules are now flagged for removal:

1. `[/\/\/ System: [^\n]+\n/g, '']` - **REMOVE** (deletes semantics)
2. `[/\/\/ [^\n]+ - same pattern/gi, '// same pattern']` - **REVIEW** (context loss)

### Safe Rules (Retain)

- `[/Previous:/g, 'Prev:']` - Safe, minimal semantic impact
- `[/Current request:/g, 'Current:']` - Safe
- `[/Please analyze/gi, 'Analyze']` - Safe
- `[/User asks about/gi, 'User asked:']` - Safe
- `[/Return suggestions as a bullet list/gi, 'Return bullets']` - Safe
- `[/Identify the duplication and suggest refactoring/gi, 'Find duplication + refactor']` - Safe
- `[/Review and suggest improvements/gi, 'Review + suggest']` - Safe
- `[/Analyze and optimize the patterns/gi, 'Analyze + optimize']` - Safe
- Regex that matches function names - **REVIEW** (may match important signatures)

---

## Real Workload Validation

### Test Prompts Required

1. **Coding prompts** - Real bug fixes from actual sessions
2. **Architecture discussions** - Design docs, PR reviews
3. **Documentation generation** - README, API docs
4. **Multi-file edits** - Across multiple files
5. **Long conversation history** - Real Claude Code sessions

### Validation Plan

1. Collect 20 real-world prompts (not synthetic fixtures)
2. Run baseline compression (no phrase normalization)
3. Run with current phrase normalization
4. Compare output meaning (human review)
5. Identify false gains

### Pending: Real Workload Dataset

*Awaiting collection of actual tokenklaw requests from `.tokenklaw/requests.jsonl`.*

---

## Recommended Actions

1. **IMMEDIATE: Remove `[/\/\/ System: [^\n]+\n/g, '']` from PHRASE_NORMALIZATIONS**

2. **IMMEDIATE: Review `[/\/\/ [^\n]+ - same pattern/gi, '// same pattern']`**

3. **Before v1.4: Create real-workload validation dataset**

4. **Before v1.4: Run benchmark on non-synthetic prompts**

5. **Before v1.4: Add semantic preservation tests**

---

## Conclusion

v1.3 benchmark gains are an artifact of destructive regex rules, not real compression.

The 3-10% gains on Small/Large scenarios are likely similarly inflated.

**Do not proceed to keyword expansion until semantic drift is fixed.**

---

*Findings by: Claude Code (validation analysis)*