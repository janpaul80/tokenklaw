# OpenCode Integration Investigation

**Status**: Investigation Phase  
**Last Updated**: 2026-05-31  
**Investigator**: Claude Code (TokenKlaw)

## Executive Summary

OpenCode is listed as a target runtime but no specific well-known "OpenCode" AI coding agent was found. There are several possibilities.

## Findings

### Not Found

No specific single tool called "OpenCode" that is a widely-used AI coding agent like Claude Code or Cursor.

### Possible Interpretations

1. **OpenVSCode (Web)**: VS Code in the browser - not a coding agent
2. **OpenCode Project**: Various open-source projects with "opencode" names, but not AI coding agents
3. **Generic Term**: "Open Code" - could refer to open-source coding tools in general
4. **Planned/Internal**: A future runtime not yet released

### Related Tools That Exist

- **VS Code**: Microsoft's editor, but not an AI agent itself
- **Cursor**: AI-powered VS Code (already in matrix as "Cursor")
- **VSCodium**: Open-source VS Code variant
- **Code OSS**: Open-source code editor base

## What We Need

If OpenCode refers to something specific:

- Configuration directory and format
- Custom command system
- Hook/preprocessing capabilities
- Status indicator system

## Integration Possibilities

If this refers to a generic open code tool:

1. **Prompt Injection**: For tools that accept natural language prompts
2. **Config Files**: Write token optimization settings to config
3. **Wrapper Scripts**: Wrap CLI calls with TokenKlaw

If OpenCode is VS Code-based:

- **VS Code Extensions**: Could write as a VS Code extension
- **Settings.json**: Inject into user settings
- **Keybindings**: Register keyboard shortcuts for TokenKlaw commands

## Blocker Assessment

**Current Status**: ⚠️ Blocker - Need clarification on what "OpenCode" refers to

**Clarification Needed**:

1. Is "OpenCode" a specific project or repository?
2. Does it have a website or documentation?
3. What is the configuration system?

## Next Steps

1. Verify what "OpenCode" refers to
2. If it's a generic term, clarify the actual target
3. Once verified, analyze configuration and hooks

## Request for Information

To proceed with OpenCode integration:

- Link to OpenCode repository or documentation
- Configuration file examples
- Clarification if "OpenCode" refers to something else