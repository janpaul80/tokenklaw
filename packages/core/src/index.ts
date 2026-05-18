/**
 * Core runtime for TokenKlaw.
 * File-storage-first implementation (JSONL/flat-file) for zero native install friction.
 */
import type { ProviderId, RequestRecord, CacheEntry, AggregatedStats } from '@tokenklaw/shared';
import { estimateTokens as sharedEstimateTokens, fingerprint as sharedFingerprint } from '@tokenklaw/shared';
import { computeCost } from '@tokenklaw/analytics';
import { createFileStorage, type FileStorage } from './storage/file';
export * from './activation';

declare const process: { env: Record<string, string | undefined> };
declare function require(name: string): any;
declare const console: { log: (...args: any[]) => void };

const DEFAULT_DATA_DIR = process.env.TOKENKLAW_DATA_DIR || './.tokenklaw';

export interface CoreContext {
  storage: FileStorage;
  storageMode: 'file';
  fingerprint(prompt: string, context?: string): string;
  estimateTokens(text: string): number;
  computeCost(providerId: ProviderId, promptTokens: number, completionTokens?: number): number;
  checkCache(hash: string): CacheEntry | null;
  persistCache(entry: CacheEntry): void;
  persistRequest(rec: RequestRecord): void;
  handleRequest(opts: { prompt: string; context?: string; provider?: ProviderId; forceNoCache?: boolean }): { request: RequestRecord; cacheHit: boolean; response: string };
  getRecentRequests(limit?: number): RequestRecord[];
  getAggregatedStats(opts?: { since?: number; until?: number }): AggregatedStats;
  close(): void;
}

export function bootstrap(dataDir = DEFAULT_DATA_DIR, defaultProvider: ProviderId = 'local'): CoreContext {
  const storage = createFileStorage(dataDir);
  storage.ensureReady();

  const fingerprint = (prompt: string, context?: string) => sharedFingerprint(prompt, context);
  const estimateTokens = (text: string) => sharedEstimateTokens(text);

  const computeCostWrapper = (providerId: ProviderId, promptTokens: number, completionTokens = 0) => {
    const pricing = storage.getProviderById(providerId);
    return computeCost(pricing, promptTokens, completionTokens);
  };

  const checkCache = (hash: string): CacheEntry | null => storage.getCache(hash);

  const persistCache = (entry: CacheEntry): void => {
    storage.upsertCache(entry);
  };

  const persistRequest = (rec: RequestRecord): void => {
    storage.appendRequest(rec);
  };

  const handleRequest = (opts: { prompt: string; context?: string; provider?: ProviderId; forceNoCache?: boolean }) => {
    const providerId = opts.provider ?? defaultProvider;
    const hash = fingerprint(opts.prompt, opts.context);
    const tokens = estimateTokens(opts.prompt + ' ' + (opts.context ?? ''));
    const now = Date.now();

    const cacheEntry = opts.forceNoCache ? null : checkCache(hash);
    let cacheHit = false;
    let response: string;

    if (cacheEntry) {
      cacheHit = true;
      response = cacheEntry.response;
    } else {
      response = JSON.stringify({ ok: true, echo: opts.prompt.slice(0, 200) });
      persistCache({ hash, response, provider: providerId, created_at: now });
    }

    const cost = computeCostWrapper(providerId, tokens, 0);
    const rec: RequestRecord = {
      id: `${hash}:${now}`,
      hash,
      prompt: opts.prompt,
      context: opts.context ?? null,
      tokens,
      provider: providerId,
      status: cacheHit ? 'cache_hit' : 'cache_miss',
      cost_estimate_cents: cost,
      cached_response: cacheHit ? response : null,
      created_at: now,
    };

    persistRequest(rec);
    return { request: rec, cacheHit, response };
  };

  const getRecentRequests = (limit = 50): RequestRecord[] => storage.getRecentRequests(limit);

  const getAggregatedStats = (opts: { since?: number; until?: number } = {}): AggregatedStats => {
    const rows = storage.getAllRequests().filter(r => {
      if (opts.since !== undefined && r.created_at < opts.since) return false;
      if (opts.until !== undefined && r.created_at > opts.until) return false;
      return true;
    });

    const total_requests = rows.length;
    const total_tokens = rows.reduce((sum, r) => sum + (r.tokens || 0), 0);
    const total_cost_cents = rows.reduce((sum, r) => sum + (r.cost_estimate_cents || 0), 0);
    const cache_hits = rows.reduce((sum, r) => sum + (r.status === 'cache_hit' ? 1 : 0), 0);
    const cache_hit_rate = total_requests ? cache_hits / total_requests : 0;
    const savings_cents = rows.reduce((sum, r) => sum + (r.status === 'cache_hit' ? (r.cost_estimate_cents || 0) : 0), 0);

    return {
      total_requests,
      total_tokens,
      total_cost_cents,
      cache_hits,
      cache_hit_rate,
      savings_cents,
    };
  };

  const close = (): void => {
    // no-op for file storage
  };

  return {
    storage,
    storageMode: 'file',
    fingerprint,
    estimateTokens,
    computeCost: computeCostWrapper,
    checkCache,
    persistCache,
    persistRequest,
    handleRequest,
    getRecentRequests,
    getAggregatedStats,
    close,
  };
}

export function handleRequest(opts: { prompt: string; context?: string; provider?: ProviderId; forceNoCache?: boolean }) {
  const core = bootstrap();
  const result = core.handleRequest(opts);
  core.close();
  return result;
}

export function createServer(dataDir = DEFAULT_DATA_DIR, opts: { host?: string; port?: number } = {}): any {
  const fastify = require('fastify')({ logger: true });
  const core = bootstrap(dataDir);
  const host = opts.host ?? '127.0.0.1';
  const port = opts.port ?? 9999;

  fastify.post('/v1/request', async (req: any, reply: any) => {
    const { prompt, context, provider, forceNoCache } = req.body as any;
    const { request, cacheHit, response } = core.handleRequest({ prompt, context, provider, forceNoCache });
    reply.send({ cached: cacheHit, response, tokens: request.tokens, cost_estimate_cents: request.cost_estimate_cents, storage: core.storageMode });
  });

  fastify.get('/v1/inspect', async (req: any, reply: any) => {
    const limit = parseInt(req.query.limit as any, 10) || 50;
    const rows = core.getRecentRequests(limit);
    reply.send(rows);
  });

  fastify.get('/v1/stats', async (req: any, reply: any) => {
    const since = req.query.since ? Number(req.query.since) : undefined;
    const until = req.query.until ? Number(req.query.until) : undefined;
    const stats = core.getAggregatedStats({ since, until });
    reply.send(stats);
  });

  fastify.addHook('onClose', async () => {
    core.close();
  });

  return {
    fastify,
    async listen() {
      await fastify.listen({ host, port });
      console.log(`TokenKlaw runtime listening on http://${host}:${port}`);
    },
  };
}
