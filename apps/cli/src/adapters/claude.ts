// Claude Code adapter skeleton
import { handleRequest } from '@tokenklaw/core';

export function runClaude(prompt: string, context?: string) {
  return handleRequest({ prompt, context, provider: 'claude' });
}
