export type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface ProviderRequest {
  prompt: string;
  context?: string;
}

export interface ProviderResponse {
  raw: unknown;
}

export interface Provider {
  name: ProviderName;
  request(req: ProviderRequest): Promise<ProviderResponse>;
}

export class ProviderRegistry {
  private providers = new Map<ProviderName, Provider>();

  register(p: Provider) {
    this.providers.set(p.name, p);
  }

  get(name: ProviderName) {
    return this.providers.get(name);
  }
}
