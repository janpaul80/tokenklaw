# Hermes Integration Investigation

**Status**: Investigation Phase  
**Last Updated**: 2026-05-31  
**Investigator**: Claude Code (TokenKlaw)

## Executive Summary

Hermes is listed as a target runtime but no public documentation or established codebase was found through web search.

## Findings

### Not Found

- No public GitHub repository with "Hermes" as the primary name for a coding agent
- No well-known Hermes AI coding agent tool
- No configuration examples for Hermes as an AI agent
- No documentation linking Hermes to coding tasks

### Possible Interpretations

1. **Project Hermes**: There are various projects named Hermes (e.g., Shopify's Hermes templating, messaging systems). None appear to be AI coding agents.
2. **Custom/Internal**: May be a private or internal project
3. **Naming Collision**: The name "Hermes" may have been changed or may not have been publicly released
4. **Confused with other tools**: May refer to a different tool or service

## What We Need to Integrate

### Installation Path

- Configuration directory and file format
- Installation method (npm, pip, binary, else?)

### Command Support

- Custom command system
- Prompt handling interface

### Hook System

- Pre/post processing hooks
- Middleware capabilities

### Status/Badge System

- Statusline or indicator support
- Custom state display

## Integration Possibilities

Since Hermes's architecture is unknown:

1. **Generic Config**: Write config to common locations (~/.config/hermes, ./hermes.config)
2. **Environment Variables**: TokenKlaw-prefixed env vars for configuration
3. **Wrapper Integration**: Wrapper scripts wrapping Hermes calls

## Blocker Assessment

**Current Status**: ⚠️ Blocker - No identifiable codebase found

**Missing Information**:

- Hermes as a coding agent - what is it? Where is it?
- Configuration specification
- Any public documentation

## Next Steps

1. Confirm the correct name and project for "Hermes" as an AI coding agent
2. Find or await public release/documentation
3. Once available, analyze configuration and hook systems

## Request for Information

To proceed with Hermes integration, please provide:

- Link to Hermes repository or documentation
- Configuration file location and format
- Any existing integration documentation