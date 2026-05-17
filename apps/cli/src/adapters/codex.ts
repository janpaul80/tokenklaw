// Codex CLI adapter skeleton
import { handleRequest } from '@tokenklaw/core';

export function runCodex(prompt: string, context?: string) {
  return handleRequest({ prompt, context, provider: 'codex' });
}
