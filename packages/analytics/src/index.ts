/**
 * Analytics utilities for TokenKlaw.
 * Operates on the same SQLite DB used by core.
 * Provides cost estimation, aggregation and savings calculations.
 */
import { ProviderPricing, ProviderId, RequestRecord, AggregatedStats } from '@tokenklaw/shared';

/**
 * Compute cost in integer cents for a request given provider pricing and token counts.
 * If provider pricing missing for either side, treat missing side as $0.
 */
export function computeCost(
  pricing: ProviderPricing | undefined,
  promptTokens: number,
  completionTokens: number = 0
): number {
  if (!pricing) return 0;
  const promptRate = pricing.prompt_cents_per_1k ?? 0;
  const completionRate = pricing.completion_cents_per_1k ?? 0;
  const cost =
    Math.ceil((promptTokens / 1000) * promptRate) +
    Math.ceil((completionTokens / 1000) * completionRate);
  return cost;
}

/**
 * Aggregate stats over the `requests` table.
 * `since` and `until` are optional epoch‑ms bounds (inclusive).
 */
export function aggregateStats(db: any, options: { since?: number; until?: number } = {}): AggregatedStats {
  const conditions: string[] = [];
  const params: any[] = [];
  if (options.since !== undefined) {
    conditions.push('created_at >= ?');
    params.push(options.since);
  }
  if (options.until !== undefined) {
    conditions.push('created_at <= ?');
    params.push(options.until);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const row = db
    .prepare(
      `SELECT
        COUNT(*) as total_requests,
        COALESCE(SUM(tokens),0) as total_tokens,
        COALESCE(SUM(cost_estimate_cents),0) as total_cost_cents,
        COALESCE(SUM(CASE WHEN status = 'cache_hit' THEN 1 ELSE 0 END),0) as cache_hits,
        COALESCE(SUM(CASE WHEN status = 'cache_hit' THEN cost_estimate_cents ELSE 0 END),0) as savings_cents
       FROM requests ${where}`
    )
    .get(...params);

  const hitRate = row.total_requests ? row.cache_hits / row.total_requests : 0;
  return {
    total_requests: row.total_requests,
    total_tokens: row.total_tokens,
    total_cost_cents: row.total_cost_cents,
    cache_hits: row.cache_hits,
    cache_hit_rate: hitRate,
    savings_cents: row.savings_cents,
  };
}

/**
 * Helper to format cents as a dollar string, e.g. 123 -> "$1.23".
 */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
