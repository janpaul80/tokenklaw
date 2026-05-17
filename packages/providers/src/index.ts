/**
 * Provider definitions and pricing for TokenKlaw.
 * Phase‑1 provides static pricing snapshots for known agents.
 * All pricing expressed in cents per 1 000 tokens, matching shared.ProviderPricing.
 */
import { ProviderId, ProviderPricing } from '@tokenklaw/shared';

/** Default provider pricing table – values taken from public docs (2026‑05). */
export const DEFAULT_PROVIDER_PRICING: ProviderPricing[] = [
  {
    id: 'local',
    displayName: 'Local placeholder',
    prompt_cents_per_1k: 0,
    completion_cents_per_1k: 0,
  },
  {
    id: 'openai',
    displayName: 'OpenAI',
    // GPT‑4‑turbo circa May 2026: $0.015 per 1 000 prompt tokens, $0.06 per 1 000 completion tokens
    prompt_cents_per_1k: 1.5,
    completion_cents_per_1k: 6,
  },
  {
    id: 'anthropic',
    displayName: 'Anthropic Claude',
    // Claude 3.5‑Sonnet: $0.003 per 1 000 prompt, $0.015 per 1 000 completion
    prompt_cents_per_1k: 0.3,
    completion_cents_per_1k: 1.5,
  },
  {
    id: 'gemini',
    displayName: 'Google Gemini',
    // Gemini 1.5 Flash: $0.002 per 1 000 prompt, $0.005 per 1 000 completion (approx.)
    prompt_cents_per_1k: 0.2,
    completion_cents_per_1k: 0.5,
  },
  {
    id: 'ollama',
    displayName: 'Ollama (local model)',
    // No external cost – treat as free for now.
    prompt_cents_per_1k: 0,
    completion_cents_per_1k: 0,
  },
];

/** Helper to look up pricing for a given provider id. */
export function getPricing(id: ProviderId): ProviderPricing | undefined {
  return DEFAULT_PROVIDER_PRICING.find(p => p.id === id);
}

/** Seed providers table in SQLite – called from core bootstrap. */
export function seedProviders(db: any): void {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO providers (id, display_name, prompt_cents_per_1k, completion_cents_per_1k, last_updated)
     VALUES (@id, @display_name, @prompt_cents_per_1k, @completion_cents_per_1k, @last_updated)`
  );
  const now = Date.now();
  for (const p of DEFAULT_PROVIDER_PRICING) {
    stmt.run({
      id: p.id,
      display_name: p.displayName,
      prompt_cents_per_1k: p.prompt_cents_per_1k ?? null,
      completion_cents_per_1k: p.completion_cents_per_1k ?? null,
      last_updated: now,
    });
  }
}
