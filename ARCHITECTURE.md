# Architecture Overview

TokenKlaw follows a **modular, event‑driven** architecture built around a local SQLite database.

## Packages
- `@tokenklaw/shared` – common types, fingerprint, token estimator.
- `@tokenklaw/providers` – pricing table and provider registry.
- `@tokenklaw/analytics` – cost calculations, aggregated stats, savings logic.
- `@tokenklaw/core` – runtime engine, request handling, cache, Fastify server.
- `@tokenklaw/cli` – command‑line interface.

## Data Flow (run command)
1. CLI parses prompt/context and optional provider.
2. Core `handleRequest` generates deterministic fingerprint.
3. Token estimator counts tokens (naïve split).
4. Cache lookup via `hash`.
   - **Hit** → return cached response, record `cache_hit`.
   - **Miss** → generate placeholder response, store in `cache_entries`.
5. Cost estimate computed from provider pricing (cents per 1k tokens).
6. Request persisted to `requests` table with cost, status, timestamps.
7. CLI outputs JSON with fingerprint, token count, cache status, cost.

## Database Schema
- `providers` – static pricing snapshots.
- `requests` – one row per CLI/API request.
- `cache_entries` – fingerprint → response mapping.
- `token_stats` – optional rolled‑up daily aggregates.
- `sessions` – server session tracking (future use).

## Extensibility
- **Adapters** – new adapters import `core.handleRequest` and can forward to real APIs on cache miss.
- **Analytics** – plug‑in custom aggregation queries.
- **Storage** – swap SQLite for PostgreSQL in a later phase without touching core logic.

## Future Enhancements
See `ROADMAP.md` for detailed milestones.
