// Roo Code adapter skeleton
import { handleRequest } from '@tokenklaw/core';

export function runRoo(prompt: string, context?: string) {
  return handleRequest({ prompt, context, provider: 'roo' });
}
