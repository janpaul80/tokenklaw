#!/usr/bin/env node
/* TokenKlaw CLI – thin wrapper around @tokenklaw/core runtime */
declare function require(name: string): any;
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
import {
  createServer,
  handleRequest,
  bootstrap,
  installActivationArtifacts,
  installActivationArtifactsForAll,
  listSupportedAgents,
  setActivationState,
  getActivationState,
  getActivationStats,
  formatActivationEnabledMessage,
  formatActivationDisabledMessage,
} from '@tokenklaw/core';
import type { ProviderId } from '@tokenklaw/shared';

declare const process: any;
declare const console: any;

const DEFAULT_DATA_DIR = process.env.TOKENKLAW_DATA_DIR || './.tokenklaw';

function usage() {
  console.log('tokenklaw <command> [options]');
  console.log('Commands:');
  console.log('  doctor                         Check environment health');
  console.log('  run "<prompt>" [--context "<ctx>"] [--provider <id>] [--no-cache]');
  console.log('  inspect [--limit N]            Show recent requests');
  console.log('  stats [--since <ms>] [--until <ms>]');
  console.log('  proxy [--host <host>] [--port <port>]');
  console.log('  install <runtime|all> [--dry-run]');
  console.log('  activate <on|off|stats>');
}

function doctor() {
  console.log('Node version:', process.version);
  const pnpm = spawnSync('pnpm', ['--version'], { encoding: 'utf8', shell: true });
  console.log('pnpm:', pnpm.status === 0 ? pnpm.stdout.trim() : 'not found');
  console.log('storage:', 'file');
  console.log('native dependencies:', 'none required');

  try {
    const core = bootstrap(DEFAULT_DATA_DIR);
    const writable = core.storage.isWritable();
    const providers = core.storage.getProviders();
    const requestsPath = path.resolve(DEFAULT_DATA_DIR, 'requests.jsonl');
    const cachePath = path.resolve(DEFAULT_DATA_DIR, 'cache.json');
    const providersPath = path.resolve(DEFAULT_DATA_DIR, 'providers.json');

    console.log('data path:', path.resolve(DEFAULT_DATA_DIR));
    console.log('data path writable:', writable);
    console.log('provider defaults loaded:', providers.length > 0);
    console.log('requests.jsonl exists:', fs.existsSync(requestsPath));
    console.log('cache.json exists:', fs.existsSync(cachePath));
    console.log('providers.json exists:', fs.existsSync(providersPath));
    console.log('install path healthy:', writable && providers.length > 0);
    core.close();
  } catch (e) {
    console.log('doctor check failed:', (e as any).message);
  }
}

function parseRunArgs(args: string[]) {
  const result: { prompt: string; context?: string; provider?: ProviderId; forceNoCache?: boolean } = { prompt: '' };
  // first non-flag argument after command is prompt
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const flag = arg.slice(2);
      switch (flag) {
        case 'context':
          result.context = args[i + 1];
          i += 2;
          break;
        case 'provider':
          result.provider = args[i + 1] as ProviderId;
          i += 2;
          break;
        case 'no-cache':
          result.forceNoCache = true;
          i += 1;
          break;
        default:
          console.error('unknown flag', flag);
          i += 1;
      }
    } else if (!result.prompt) {
      result.prompt = arg;
      i += 1;
    } else {
      // extra positional arguments ignored for now
      i += 1;
    }
  }
  if (!result.prompt) {
    console.error('run requires a prompt string');
    process.exit(2);
  }
  return result;
}

function cmdRun(args: string[]) {
  const opts = parseRunArgs(args);
  const { request, cacheHit, response } = handleRequest({
    prompt: opts.prompt,
    context: opts.context,
    provider: opts.provider,
    forceNoCache: opts.forceNoCache,
  });

  const out = {
    requestId: request.id,
    fingerprint: request.hash,
    tokens: request.tokens,
    provider: request.provider,
    cacheHit,
    cost_estimate_cents: request.cost_estimate_cents,
    response_preview: response.slice(0, 200),
  };
  console.log(JSON.stringify(out, null, 2));
}

function cmdInspect(args: string[]) {
  let limit = 50;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10) || limit;
      i++;
    }
  }
  const core = bootstrap(DEFAULT_DATA_DIR);
  const rows = core.getRecentRequests(limit);
  core.close();
  console.log(JSON.stringify(rows, null, 2));
}

function cmdStats(args: string[]) {
  const options: { since?: number; until?: number } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--since' && args[i + 1]) {
      options.since = Number(args[i + 1]);
      i++;
    } else if (args[i] === '--until' && args[i + 1]) {
      options.until = Number(args[i + 1]);
      i++;
    }
  }

  const core = bootstrap(DEFAULT_DATA_DIR);
  const stats = core.getAggregatedStats(options);
  core.close();
  console.log(JSON.stringify(stats, null, 2));
}

function cmdInstall(args: string[]) {
  const target = args[0];
  const dryRun = args.includes('--dry-run');

  if (!target) {
    console.error(
      'install requires a runtime: claude|codex|roo|cursor|cline|continue|gemini|openclaw|hermes|windsurf|opencode|aider|opendevin|all'
    );
    process.exit(2);
  }

  if (target === 'all') {
    const results = installActivationArtifactsForAll({ dryRun });
    console.log(JSON.stringify({ ok: true, dryRun, installs: results }, null, 2));
    return;
  }

  const supported = listSupportedAgents();
  if (!supported.includes(target as any)) {
    console.error(`unknown agent "${target}". Supported: ${supported.join(', ')}, all`);
    process.exit(2);
  }

  const result = installActivationArtifacts(target as any, { dryRun });
  console.log(JSON.stringify({ ok: true, dryRun, install: result }, null, 2));
}

function cmdActivate(args: string[]) {
  const mode = args[0];

  if (!mode || !['on', 'off', 'stats'].includes(mode)) {
    console.error('activate requires mode: on|off|stats');
    process.exit(2);
  }

  if (mode === 'stats') {
    const state = getActivationState(DEFAULT_DATA_DIR);
    const stats = getActivationStats(DEFAULT_DATA_DIR);
    console.log(
      JSON.stringify(
        {
          active: state.enabled,
          mode: state.mode,
          context_reduction: state.enabled,
          duplicate_detection: state.enabled,
          cache_guidance: state.enabled,
          verbose_replies: state.enabled ? 'reduced' : 'default',
          token_saving_mode: state.enabled ? 'enabled' : 'disabled',
          stats,
        },
        null,
        2
      )
    );
    return;
  }

  const updated = setActivationState(mode as 'on' | 'off', DEFAULT_DATA_DIR);
  if (updated.enabled) {
    console.log(formatActivationEnabledMessage());
  } else {
    console.log(formatActivationDisabledMessage());
  }
}

async function cmdProxy(args: string[]) {
  let host = '127.0.0.1';
  let port = 9999;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--host' && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10) || port;
      i++;
    }
  }
  const server = createServer();
  await server.listen({ host, port });
}

const cmd = process.argv[2] || 'help';
const cmdArgs = process.argv.slice(3);
switch (cmd) {
  case 'doctor':
    doctor();
    break;
  case 'run':
    cmdRun(cmdArgs);
    break;
  case 'inspect':
    cmdInspect(cmdArgs);
    break;
  case 'stats':
    cmdStats(cmdArgs);
    break;
  case 'proxy':
    cmdProxy(cmdArgs);
    break;
  case 'install':
    cmdInstall(cmdArgs);
    break;
  case 'activate':
    cmdActivate(cmdArgs);
    break;
  default:
    usage();
    break;
}
