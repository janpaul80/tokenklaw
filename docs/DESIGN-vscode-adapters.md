# VSCode Extension Adapters - Discovery

## Cursor (VS Code Fork)

| Item | Finding |
|------|---------|
| Directory | `~/.cursor/` |
| TokenKlaw | ✅ Installed |
| Own files | ✅ VS Code config |

**Status**: Scaffolded - needs validation

---

## Cline (VS Code Extension)

| Item | Finding |
|------|---------|
| Directory | `~/.cline/` |
| TokenKlaw | ✅ Installed |
| Own files | VS Code extension |

**Status**: Scaffolded - needs validation

---

## Continue (VS Code Extension)

| Item | Finding |
|------|---------|
| Directory | `~/.continue/` |
| TokenKlaw | ✅ Installed |
| Own files | VS Code config |

**Status**: Scaffolded - needs validation

---

## Roo (VS Code Extension)

| Item | Finding |
|------|---------|
| Directory | `~/.roo/` |
| TokenKlaw | ✅ Installed |
| Own files | VS Code config |

**Status**: Scaffolded - needs validation

---

## Consumption Tests for VSCode Extensions

All VSCode-based extensions share similar testing:

1. **Detect**: VS Code installed?
2. **Install**: TokenKlaw writes to config directory
3. **Activate**: VS Code loads extension
4. **Consume**: Extension reads config/prompts?

## Pass/Fail Criteria

For VS Code extensions:
- [ ] Extension loads
- [ ] Config file present
- [ ] Prompt/command recognized
- [ ] Behavior changes