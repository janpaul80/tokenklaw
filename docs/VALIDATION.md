# TokenKlaw Runtime Validation Definitions

## Validation Levels

### 1. Investigation

**Definition**: Initial research phase. We don't know if the runtime exists or how it works.

| Criteria | Evidence Required |
|----------|------------------|
| Runtime exists | Can we find it? (PATH, config, binary) |
| Installation path | Where does it install? |
| Documentation | Any docs found? |

**Current Status**: Gemini, OpenCode, Windsurf, aider, OpenDevin

---

### 2. Scaffolded

**Definition**: TokenKlaw generates artifacts for the runtime, but consumption is unproven.

| Criteria | Evidence Required |
|----------|------------------|
| TokenKlaw generates files | Installer creates files to runtime directory |
| Files written | Can we verify files exist? |
| Install tested | Does `tokenklaw install <runtime>` work? |

**What's Missing**: 
- Runtime actually reads/consumes the files
- No proof of hook execution
- No proof of activation working

**Current Status**: OpenClaw, Hermes, Codex, Roo, Cursor, Cline, Continue

---

### 3. Validated

**Definition**: TokenKlaw artifacts are actually consumed by the runtime.

| Criteria | Evidence Required |
|----------|------------------|
| Command recognition | Does runtime recognize `/tokenklaw`? |
| Hook execution | Do hooks run? |
| Status output | Does statusline/badge work? |
| Activation state changes | Does state file affect behavior? |
| Runtime behavior changes | Does enabling TokenKlaw change output? |

**Proven For Claude Code**:
1. ✅ Command files loaded (`/tokenklaw`, `/tk`)
2. ✅ Hooks executed (UserPromptExpansion)
3. ✅ Statusline works (`[TOKENKLAW]` badge)
4. ✅ Activation state persists
5. ✅ Output changed when activated

---

## Validation Evidence Categories

### File-Based Evidence (Scaffolded Level)

| Evidence | Description |
|----------|-------------|
| plugin.json | Plugin config exists |
| commands/ | Command directory exists |
| skills/ | Skills directory exists |
| settings.json | Settings file with hooks |
| middleware/ | Middleware directory |

### Runtime-Based Evidence (Validated Level)

| Evidence | Description | How to Verify |
|---------|-------------|--------------|
| Command recognized | Runtime responds to /tokenklaw | Run command, check response |
| Hook fires | Pre/post hooks execute | Add log, run prompt |
| Statusline displays | Badge shows in statusline | Check UI |
| State affects output | Toggle state changes output | Activate, check response |
| Memory compression | Context is shorter | Compare token counts |

---

## Validation Matrix Template

```
Runtime: <name>
Installation Path: ~/.runtime/
Detection: [detect() output]
File Evidence: [files found]
Command Recognition: [pass/fail]
Hook Execution: [pass/fail]
Statusline: [pass/fail]
State Persistence: [pass/fail]
Behavior Change: [pass/fail]

Result: Validated / Scaffolded / Investigation
```

---

## Evidence Collection Methods

### Automated (via Adapter)

```typescript
// detect() - check directory exists
// validate() - check files exist

// NEW: runtimeConsumes() - check actual usage
async runtimeConsumes(): Promise<boolean> {
  // Method 1: Check log files
  const logs = readLogs();
  
  // Method 2: Check hook invocations
  const hooks = checkHookExecution();
  
  // Method 3: Check output differences
  const baseline = runPrompt(baseline);
  const active = runPrompt(active);
  
  return hooks.length > 0 || baseline !== active;
}
```

### Manual

1. Run `/tokenklaw` - verify response
2. Check statusline - verify badge
3. Run with TokenKlaw off - compare output
4. Check logs for hook execution

---

## Claude Code Validation Evidence

### Current Validated Proofs

| Evidence | Proof |
|----------|-------|
| **Command files exist** | ✅ 23 files in ~/.claude/tokenklaw |
| **Commands recognized** | /tokenklaw, /tk work |
| **Hooks configured** | settings.json has hooks |
| **Hook executes** | UserPromptExpansion fires |
| **Statusline works** | [TOKENKLAW] badge shows |
| **State persists** | activation-state.json exists |
| **Behavior affected** | Output optimization observed |

### From validate() Output

```
evidence: [
  "Found: plugin.json",
  "Found: settings.json", 
  "hooks configured in settings.json"
]
```

### Gap Still Present

- Missing: `tokenklaw command` - command file exists but not invoked?

---

## OpenClaw Validation Requirements (For Future)

To become "Validated":

1. **File Evidence** (Already scaffolded)
   - Files written to ~/.openclaw/tokenklaw/

2. **Runtime Consumption** (Needed)
   - [ ] OpenClaw loads SOUL.md
   - [ ] OpenClaw uses middleware
   - [ ] TokenKlaw command recognized
   - [ ] Activation state affects output

---

## Gap Analysis Summary

| Runtime | Files | Commands | Hooks | Statusline | Behavior | Status |
|---------|------|----------|------|-----------|---------|-------|
| Claude | ✅ | ✅ | ✅ | ✅ | ✅ | Validated |
| OpenClaw | ✅ | ❌ | ❌ | ❌ | ❌ | Scaffolded |
| Hermes | ✅ | ❌ | ❌ | ❌ | ❌ | Scaffolded |
| Others | Scaffold/Investigation | | | | | |

**Legend**: 
- ✅ = Proven
- ❌ = Not proven
- (empty) = Not investigated