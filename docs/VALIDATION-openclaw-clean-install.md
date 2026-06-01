# OpenClaw Clean Validation Process

**Purpose**: Establish clean-room proof of TokenKlaw consumption by OpenClaw

**Status**: Design/Procedure Only  
**Requirement**: Fresh install + verification required before classification change

---

## Why Clean Validation?

Current `.openclaw/` directory:
- Contains personal/OpenClaw state from another project
- May have been partially cleaned
- May not represent fresh OpenClaw install
- **Cannot be used as proof of TokenKlaw consumption**

---

## Clean Validation Process

### Phase 1: Fresh OpenClaw Install

```bash
# 1. Install OpenClaw to clean location
# (User must provide install command)

# 2. Run OpenClaw once to generate config
openclow --init

# 3. List generated directories
ls -la ~/.openclaw/
```

**Expected directories after fresh install**:
```
~/.openclaw/
  agents/         # Agent configurations
  memory/         # Long-term memory
  plugins/        # Plugin directory
  plugin-skills/   # Skill plugins
  plugin-state/   # Plugin state
  tasks/          # Task definitions
  workspace/      # Working files
  logs/           # Runtime logs
  config/         # OpenClaw config
  skills/         # Skill definitions
```

### Phase 2: Install TokenKlaw

```bash
# Install TokenKlaw to OpenClaw
tokenklaw install openclaw
```

**Expected files after TokenKlaw install**:
```
~/.openclaw/tokenklaw/
  SOUL.md                    # Compact operational memory
  middleware.token-compression.md  # Compression pipeline
  tokenklaw.rules.md         # Token budget rules
  tokenklaw.skill.md        # Skill definition
  tokenklaw.prompt.md       # Prompt template
  tokenklaw.slash-commands.md
  runtime-capabilities.json
  runtime-notes.md
```

### Phase 3: Test Activation

```bash
# Try to activate TokenKlaw
/tokenklaw
# or
/tk

# Check for response
# Check status output
```

### Phase 4: Verify Consumption

**What to verify**:

| Check | Method |
|-------|--------|
| OpenClaw loads skills | Check if SOUL.md is read |
| OpenClaw runs hooks | Check runtime logs for hook invocation |
| Command recognized | Run /tokenklaw, check response |
| Status works | Check if status is displayed |
| Memory compression | Compare token counts |

### Phase 5: Pass/Fail Criteria

**PASS** (Become Validated):
- [ ] OpenClaw runs to fresh install
- [ ] Generated directories match expected list
- [ ] TokenKlaw files install to correct location
- [ ] At least ONE proof of consumption:
  - Command responds
  - Hook executes in logs
  - Memory files affect output
  - Status displays

**FAIL** (Remain Scaffolded):
- [ ] OpenClaw cannot be installed fresh
- [ ] Generated directories missing
- [ ] TokenKlaw files install fails
- [ ] No consumption evidence after testing

---

## Implementation Requirements

### Before Validation

1. Get clean OpenClaw install method
2. Get OpenClaw binary location
3. Verify OpenClaw runs

### During Validation

1. Run fresh install
2. Run OpenClaw to generate config
3. Capture directory listing BEFORE TokenKlaw install
4. Install TokenKlaw
5. Run OpenClaw with various prompts
6. Check logs for evidence

### Documentation

Capture:
- Install command used
- Pre-install directory listing
- Post-install directory listing
- Logs/output from OpenClaw execution
- Any evidence of TokenKlaw consumption

---

## Current Classification

**OpenClaw**: **Scaffolded** (files generated, no clean consumption proof)

**Next step**: Clean validation when OpenClaw install method is provided

---

## Notes

- Do NOT use existing `.openclaw/` as proof
- Do NOT modify personal OpenClaw installation
- Clean install required for valid classification