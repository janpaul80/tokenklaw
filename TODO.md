# TokenKlaw v0.1 File-Storage-First Migration TODO

- [ ] Inspect runtime and CLI storage usage paths (`packages/core`, `apps/cli`, `packages/analytics`, `packages/providers`, `packages/shared`)
- [ ] Define `StorageAdapter` interface for cache/requests/providers operations
- [ ] Implement default file-based storage adapter (JSONL/flat-file, cross-platform, no native deps)
- [ ] Wire core runtime to use file storage by default
- [ ] Remove hard dependency path on `better-sqlite3` from default install/build
- [ ] Update `pnpm doctor` output to include:
  - [ ] storage: file
  - [ ] native dependencies: none required
  - [ ] install path healthy
- [ ] Update README to state out-of-box install, SQLite optional/future advanced mode
- [ ] Update docs/INSTALL.md to remove VS C++ requirement from default setup and mark SQLite optional
- [ ] Run clean clone test on Windows Node 24:
  - [ ] `pnpm install`
  - [ ] `pnpm build`
  - [ ] `pnpm doctor`
- [ ] Commit and push
- [ ] Report files changed, test outputs, commit hash, and push output
