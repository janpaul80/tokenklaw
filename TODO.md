# TokenKlaw Command Reliability TODO

- [ ] Inspect command artifact generation in `packages/core/src/activation.ts` for `/tokenklaw`, `/tk`, `/tokenklaw-help`, `/tokenklaw-off`
- [ ] Implement deterministic local/static command responses in Claude artifacts (no upstream dependency for simple commands)
- [ ] Add provider-failure fallback wording for upstream 402/5xx conditions in Claude skill/hook/docs artifacts
- [ ] Align off-command verbose wording to expected output (`normal` instead of `default`)
- [ ] Update README/docs with clear note: command recognition is local/plugin-based; upstream billing/quota errors may still occur in host runtime
- [ ] Build and test:
  - [ ] `pnpm -r build`
  - [ ] `node apps/cli/dist/index.js install claude --dry-run`
  - [ ] `node apps/cli/dist/index.js install claude`
  - [ ] Verify generated Claude files contain static deterministic responses
- [ ] Capture outputs:
  - [ ] root-cause confirmation
  - [ ] files changed
  - [ ] test output
  - [ ] commit hash
  - [ ] push output
  - [ ] safe-to-record decision
