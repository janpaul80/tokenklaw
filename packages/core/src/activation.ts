declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

declare const process: { env: Record<string, string | undefined>; platform?: string };

export type AgentId =
  | 'claude'
  | 'codex'
  | 'roo'
  | 'cursor'
  | 'cline'
  | 'continue'
  | 'gemini'
  | 'openclaw'
  | 'hermes'
  | 'windsurf'
  | 'opencode'
  | 'aider'
  | 'opendevin';

export type ActivateMode = 'on' | 'off';

export type ActivationMechanism = 'slash' | 'prompt-injection' | 'skill' | 'config' | 'middleware' | 'unknown';

export interface RuntimeCapability {
  agent: AgentId;
  supportsCustomSlashCommands: boolean | 'unknown';
  activationMechanism: ActivationMechanism;
  installTarget: string;
  status: 'implemented' | 'scaffold' | 'experimental';
  notes: string;
}

export interface InstallOptions {
  dataDir?: string;
  dryRun?: boolean;
}

export interface InstallFile {
  name: string;
  content: string;
}

export interface InstallTarget {
  agent: AgentId;
  dir: string;
  files: InstallFile[];
}

export interface InstallResult {
  agent: AgentId;
  dir: string;
  written: string[];
  dryRun: boolean;
}

export interface ActivationState {
  enabled: boolean;
  mode: 'token-saving';
  conciseReplies: boolean;
  duplicateDetection: boolean;
  cacheGuidance: boolean;
  compressedLogs: boolean;
  summarizeStackTraces: boolean;
  updatedAt: number;
}

export interface ActivationStats {
  activated_count: number;
  deactivated_count: number;
  last_activated_at: number | null;
  last_deactivated_at: number | null;
}

interface RuntimeInstaller {
  readonly agent: AgentId;
  buildTarget(): InstallTarget;
}

const DEFAULT_DATA_DIR = process.env.TOKENKLAW_DATA_DIR || './.tokenklaw';

const AGENTS: AgentId[] = [
  'claude',
  'codex',
  'roo',
  'cursor',
  'cline',
  'continue',
  'gemini',
  'openclaw',
  'hermes',
  'windsurf',
  'opencode',
  'aider',
  'opendevin',
];

const SUPPORTED_RUNTIME_CAPABILITIES: RuntimeCapability[] = [
  {
    agent: 'claude',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'skill',
    installTarget: '.claude + .claude-plugin',
    status: 'implemented',
    notes:
      'Plugin-style integration implemented with TokenKlaw metadata and command scaffolding. Slash command official support remains to be validated in Claude Code runtime behavior.',
  },
  {
    agent: 'codex',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'config',
    installTarget: '.codex/tokenklaw',
    status: 'implemented',
    notes: 'Installer emits universal TokenKlaw activation artifacts and capability notes.',
  },
  {
    agent: 'roo',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'skill',
    installTarget: '.roo/tokenklaw',
    status: 'implemented',
    notes: 'Installer emits skill/prompt/rules scaffolding and capability notes.',
  },
  {
    agent: 'cursor',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'prompt-injection',
    installTarget: '.cursor/tokenklaw',
    status: 'implemented',
    notes: 'Installer emits context/prompt scaffolding with explicit unknown slash-command status.',
  },
  {
    agent: 'cline',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'skill',
    installTarget: '.cline/tokenklaw',
    status: 'implemented',
    notes: 'Installer emits activation scaffolding and does not claim official slash support.',
  },
  {
    agent: 'continue',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'config',
    installTarget: '.continue/tokenklaw',
    status: 'implemented',
    notes: 'Installer emits config-like activation docs and capability metadata.',
  },
  {
    agent: 'gemini',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'prompt-injection',
    installTarget: '.gemini/tokenklaw',
    status: 'implemented',
    notes: 'Gemini / Antigravity installer uses prompt/context scaffolding and capability notes.',
  },
  {
    agent: 'openclaw',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'middleware',
    installTarget: '.openclaw/tokenklaw',
    status: 'implemented',
    notes: 'Installer includes SOUL/context compression and middleware-oriented activation scaffold.',
  },
  {
    agent: 'hermes',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'middleware',
    installTarget: '.hermes/tokenklaw',
    status: 'implemented',
    notes: 'Installer includes startup context injection and memory compression scaffold.',
  },
  {
    agent: 'windsurf',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'unknown',
    installTarget: '.windsurf/tokenklaw',
    status: 'scaffold',
    notes: 'Future scaffold runtime integration target.',
  },
  {
    agent: 'opencode',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'unknown',
    installTarget: '.opencode/tokenklaw',
    status: 'scaffold',
    notes: 'Future scaffold runtime integration target.',
  },
  {
    agent: 'aider',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'unknown',
    installTarget: '.aider/tokenklaw',
    status: 'scaffold',
    notes: 'Future scaffold runtime integration target.',
  },
  {
    agent: 'opendevin',
    supportsCustomSlashCommands: 'unknown',
    activationMechanism: 'unknown',
    installTarget: '.opendevin/tokenklaw',
    status: 'scaffold',
    notes: 'Future scaffold runtime integration target.',
  },
];

function getHomeDir(): string {
  const home = process.env.USERPROFILE || process.env.HOME || '.';
  return path.resolve(home);
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileSafe(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getCapability(agent: AgentId): RuntimeCapability {
  const capability = SUPPORTED_RUNTIME_CAPABILITIES.find(c => c.agent === agent);
  if (!capability) {
    return {
      agent,
      supportsCustomSlashCommands: 'unknown',
      activationMechanism: 'unknown',
      installTarget: `${agent}/tokenklaw`,
      status: 'experimental',
      notes: 'No explicit capability metadata found. Using fallback install scaffold.',
    };
  }
  return capability;
}

function buildPolicyBlock(agentLabel: string): string {
  return `# TokenKlaw Activation Policy (${agentLabel})

When TokenKlaw is active, optimize for token efficiency without reducing technical correctness.

Behavior rules:
1) Keep replies concise, technical, and actionable.
2) Avoid filler, motivational text, and repeated framing.
3) Do not restate full repository context unless explicitly requested.
4) Deduplicate repeated errors/log lines/stack-trace fragments.
5) Summarize large logs and stack traces; include only high-signal lines first.
6) Preserve exact code, commands, file paths, and configuration details.
7) Preserve correctness over brevity when there is tradeoff.
8) Prefer bullet points or compact steps over long paragraphs.
9) If context is repeated in session, reference prior conclusions instead of re-expanding.
10) If user asks for deep explanation, provide it, but still avoid redundant repetition.

Slash commands to recognize:
- /tokenklaw         => activate token-saving behavior
- /tk                => alias for /tokenklaw
- /tokenklaw off     => disable token-saving behavior
- /tokenklaw stats   => show token-saving mode and compact session guidance
`;
}

function buildSkillTemplate(agentLabel: string): string {
  return `# TokenKlaw Skill (${agentLabel})

State machine:
- Active state: concise, deduplicated, compressed-context responses.
- Inactive state: default response style.

Critical response rule:
- Return final user-facing output only.
- Never reveal chain-of-thought, hidden reasoning, scratchpad, planning, or self-explanations.
- Never narrate internal analysis (e.g., "I need to...", "let me think...", "from the skill description...").

Command handling (final output only):
- "/tokenklaw" or "/tk": switch to Active state and reply exactly:
  TokenKlaw active.
- "/tokenklaw off": switch to Inactive state and reply exactly:
  TokenKlaw inactive.
- "/tokenklaw stats": display only this compact status block:
  TokenKlaw active: on/off
  Context reduction: on/off
  Duplicate detection: on/off
  Cache guidance: on/off
  Verbose replies: reduced/default
`;
}

function buildPromptTemplate(agentLabel: string): string {
  return `You are operating with TokenKlaw mode support for ${agentLabel}.

Hard output constraint:
- Provide only final answer text to the user.
- Do not expose internal reasoning, hidden analysis, planning traces, or self-commentary.

If user issues /tokenklaw or /tk, apply token-saving policy and output exactly:
TokenKlaw active.

If user issues /tokenklaw off, disable policy and output exactly:
TokenKlaw inactive.

If user issues /tokenklaw stats, print only compact status block (no explanation).

Default when active:
- concise technical replies
- no filler
- no duplicated context
- compressed logs and stack traces
- accurate commands/paths/code
`;
}

function buildSlashInstruction(agentLabel: string): string {
  return `# TokenKlaw Slash Command Instructions (${agentLabel})

Recognize these user commands in chat:
1) /tokenklaw
2) /tk
3) /tokenklaw off
4) /tokenklaw stats

Activation response format:
TokenKlaw active.
Context reduction: on
Duplicate detection: on
Cache guidance: on
Verbose replies: reduced
Token-saving mode: enabled
`;
}

function buildCapabilityMetadata(agent: AgentId): string {
  const capability = getCapability(agent);
  return JSON.stringify(capability, null, 2);
}

function buildUniversalNotes(agent: AgentId, agentLabel: string): string {
  const capability = getCapability(agent);
  return `# TokenKlaw Runtime Notes (${agentLabel})

Runtime: ${agent}
Status: ${capability.status}
Install target: ${capability.installTarget}
Activation mechanism: ${capability.activationMechanism}
Supports custom slash commands: ${String(capability.supportsCustomSlashCommands)}

Notes:
${capability.notes}
`;
}

function getAgentBaseDir(agent: AgentId): string {
  const home = getHomeDir();
  const envOverride = process.env[`TOKENKLAW_${agent.toUpperCase()}_DIR`];
  if (envOverride) return path.resolve(envOverride);

  const isWin = (process.platform || '').startsWith('win');
  switch (agent) {
    case 'claude':
      return isWin ? path.join(home, '.claude') : path.join(home, '.config', 'claude');
    case 'codex':
      return isWin ? path.join(home, '.codex') : path.join(home, '.config', 'codex');
    case 'roo':
      return isWin ? path.join(home, '.roo') : path.join(home, '.config', 'roo');
    case 'cursor':
      return isWin ? path.join(home, '.cursor') : path.join(home, '.config', 'cursor');
    case 'cline':
      return isWin ? path.join(home, '.cline') : path.join(home, '.config', 'cline');
    case 'continue':
      return isWin ? path.join(home, '.continue') : path.join(home, '.config', 'continue');
    case 'gemini':
      return isWin ? path.join(home, '.gemini') : path.join(home, '.config', 'gemini');
    case 'openclaw':
      return isWin ? path.join(home, '.openclaw') : path.join(home, '.config', 'openclaw');
    case 'hermes':
      return isWin ? path.join(home, '.hermes') : path.join(home, '.config', 'hermes');
    case 'windsurf':
      return isWin ? path.join(home, '.windsurf') : path.join(home, '.config', 'windsurf');
    case 'opencode':
      return isWin ? path.join(home, '.opencode') : path.join(home, '.config', 'opencode');
    case 'aider':
      return isWin ? path.join(home, '.aider') : path.join(home, '.config', 'aider');
    case 'opendevin':
      return isWin ? path.join(home, '.opendevin') : path.join(home, '.config', 'opendevin');
    default:
      return path.join(home, '.tokenklaw-agent');
  }
}

function getAgentLabel(agent: AgentId): string {
  switch (agent) {
    case 'claude':
      return 'Claude Code';
    case 'codex':
      return 'Codex CLI';
    case 'roo':
      return 'Roo Code';
    case 'cursor':
      return 'Cursor';
    case 'cline':
      return 'Cline';
    case 'continue':
      return 'Continue';
    case 'gemini':
      return 'Gemini / Antigravity';
    case 'openclaw':
      return 'OpenClaw';
    case 'hermes':
      return 'Hermes';
    case 'windsurf':
      return 'Windsurf';
    case 'opencode':
      return 'OpenCode';
    case 'aider':
      return 'aider';
    case 'opendevin':
      return 'OpenDevin-style Runtime';
    default:
      return agent;
  }
}

abstract class BaseRuntimeInstaller implements RuntimeInstaller {
  readonly agent: AgentId;

  constructor(agent: AgentId) {
    this.agent = agent;
  }

  protected get agentLabel(): string {
    return getAgentLabel(this.agent);
  }

  protected get baseDir(): string {
    return getAgentBaseDir(this.agent);
  }

  protected get tokenklawDir(): string {
    return path.join(this.baseDir, 'tokenklaw');
  }

  buildTarget(): InstallTarget {
    return {
      agent: this.agent,
      dir: this.tokenklawDir,
      files: this.buildFiles(),
    };
  }

  protected buildFiles(): InstallFile[] {
    return [
      { name: 'tokenklaw.rules.md', content: buildPolicyBlock(this.agentLabel) },
      { name: 'tokenklaw.skill.md', content: buildSkillTemplate(this.agentLabel) },
      { name: 'tokenklaw.prompt.md', content: buildPromptTemplate(this.agentLabel) },
      { name: 'tokenklaw.slash-commands.md', content: buildSlashInstruction(this.agentLabel) },
      { name: 'runtime-capabilities.json', content: buildCapabilityMetadata(this.agent) },
      { name: 'runtime-notes.md', content: buildUniversalNotes(this.agent, this.agentLabel) },
    ];
  }
}

class ClaudePluginInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('claude');
  }

  buildTarget(): InstallTarget {
    const files: InstallFile[] = [];

    const pluginDir = path.join(this.baseDir, '.claude-plugin');
    const commandDir = path.join(this.baseDir, 'commands');
    const skillDir = path.join(this.baseDir, 'skills', 'tokenklaw');
    const hooksDir = path.join(this.baseDir, 'hooks');
    const docsDir = path.join(this.baseDir, 'tokenklaw');

    files.push({
      name: path.relative(this.baseDir, path.join(pluginDir, 'plugin.json')),
      content: JSON.stringify(
        {
          schema_version: '1.0',
          id: 'at.tokenklaw.activation',
          name: 'TokenKlaw',
          version: '0.1.0',
          description: 'Universal token optimization activation layer for AI coding agents.',
          author: 'TokenKlaw',
          homepage: 'https://token.klaw.at',
          entrypoints: {
            commands: ['tokenklaw', 'tk'],
            skills: ['tokenklaw'],
            hooks: ['pre-response'],
          },
        },
        null,
        2
      ),
    });

    files.push({
      name: path.relative(this.baseDir, path.join(pluginDir, 'marketplace.json')),
      content: JSON.stringify(
        {
          plugin_id: 'at.tokenklaw.activation',
          listing: {
            name: 'TokenKlaw',
            category: 'developer-tools',
            tags: ['tokens', 'compression', 'context', 'productivity'],
            summary: 'Activate token-saving mode and context compression behavior.',
          },
        },
        null,
        2
      ),
    });

    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw.toml')),
      content: `[command]
name = "tokenklaw"
description = "Activate TokenKlaw token-saving behavior"

[command.behavior]
activation = "token-saving"
aliases = ["tk"]
`,
    });

    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tk.toml')),
      content: `[command]
name = "tk"
description = "Alias for /tokenklaw"

[command.behavior]
alias_of = "tokenklaw"
`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-help.toml')),
      content: `[command]
name = "tokenklaw-help"
description = "Show TokenKlaw command help"

[command.behavior]
activation = "help"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-stats.toml')),
      content: `[command]
name = "tokenklaw-stats"
description = "Show current TokenKlaw session and token-saving status"

[command.behavior]
activation = "stats"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-off.toml')),
      content: `[command]
name = "tokenklaw-off"
description = "Disable TokenKlaw mode for the current session"

[command.behavior]
activation = "disable"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-compress.toml')),
      content: `[command]
name = "tokenklaw-compress"
description = "Compress repeated logs, stack traces, or long context into a shorter technical summary"

[command.behavior]
activation = "compress"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-review.toml')),
      content: `[command]
name = "tokenklaw-review"
description = "Review the current response or context for token waste and suggest a shorter version"

[command.behavior]
activation = "review"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-cache.toml')),
      content: `[command]
name = "tokenklaw-cache"
description = "Show cache guidance and repeated prompt behavior"

[command.behavior]
activation = "cache"`,
    });
    files.push({
      name: path.relative(this.baseDir, path.join(commandDir, 'tokenklaw-agent.toml')),
      content: `[command]
name = "tokenklaw-agent"
description = "Show supported runtime integrations and their current status"

[command.behavior]
activation = "agent"`,
    });

    files.push({
      name: path.relative(this.baseDir, path.join(skillDir, 'SKILL.md')),
      content: `# TokenKlaw Skill (Claude Code)

Use this skill to apply token-saving response behavior.

## Non-negotiable output rule
Return only final user-facing responses.
Do not output internal reasoning, analysis traces, or self-explanations.

## Commands and exact outputs
- /tokenklaw  -> TokenKlaw active.
- /tk         -> TokenKlaw active.
- /tokenklaw off -> TokenKlaw inactive.
- /tokenklaw stats -> compact status block only.

## Behavior when active
- concise technical replies
- duplicate context suppression
- compressed logs and stack traces
- preserve correctness and exact technical details
`,
    });

    files.push({
      name: path.relative(this.baseDir, path.join(hooksDir, 'tokenklaw.pre-response.md')),
      content: `# TokenKlaw Hook: pre-response

When TokenKlaw is active:
- reduce verbosity
- remove duplicate repeated context
- summarize logs by highest-signal lines
- keep commands, file paths, and code exact
- never expose hidden reasoning or internal analysis
- return final output text only
`,
    });

    files.push({
      name: 'CLAUDE.md',
      content: `# TokenKlaw Integration for Claude Code

TokenKlaw provides a token optimization activation layer.

## Intended commands
- /tokenklaw
- /tk
- /tokenklaw off
- /tokenklaw stats

## Response discipline
For command activations, output final responses only.
Never expose chain-of-thought, hidden analysis, or internal narration.

## Compatibility handling
If another mode (e.g., Caveman) is detected, prefer compatibility phrasing:
"Caveman detected. TokenKlaw compatibility mode active."

## Capability honesty
Custom slash command support may depend on Claude runtime/plugin behavior.
If commands are not recognized, verify plugin discovery/registration rules.
`,
    });

    const compatibilityFiles = super.buildFiles().map(file => ({
      name: path.relative(this.baseDir, path.join(docsDir, file.name)),
      content: file.content,
    }));

    files.push(...compatibilityFiles);

    return {
      agent: this.agent,
      dir: this.baseDir,
      files,
    };
  }
}

class CodexInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('codex');
  }
}

class RooInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('roo');
  }
}

class CursorInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('cursor');
  }
}

class ClineInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('cline');
  }
}

class ContinueInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('continue');
  }
}

class GeminiInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('gemini');
  }
}

class OpenClawInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('openclaw');
  }

  protected buildFiles(): InstallFile[] {
    return [
      ...super.buildFiles(),
      {
        name: 'SOUL.md',
        content: `# TokenKlaw SOUL Integration (OpenClaw)

Inject compact operational memory:
- dedupe repetitive context
- compress system prompt overlays
- preserve exact technical details
`,
      },
      {
        name: 'middleware.token-compression.md',
        content: `# TokenKlaw Middleware Compression Layer (OpenClaw)

Pipeline:
1) context dedupe
2) stack-trace compression
3) prompt budget optimization
4) response verbosity shaping
`,
      },
    ];
  }
}

class HermesInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('hermes');
  }

  protected buildFiles(): InstallFile[] {
    return [
      ...super.buildFiles(),
      {
        name: 'startup-context.md',
        content: `# TokenKlaw Startup Context (Hermes)

Enable:
- system prompt compression
- agent memory compression
- context dedupe hooks
`,
      },
      {
        name: 'middleware.memory-compression.md',
        content: `# TokenKlaw Memory Compression Layer (Hermes)

Apply compression to long-lived session memory while preserving code and command fidelity.
`,
      },
    ];
  }
}

class WindsurfInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('windsurf');
  }
}

class OpenCodeInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('opencode');
  }
}

class AiderInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('aider');
  }
}

class OpenDevinInstaller extends BaseRuntimeInstaller {
  constructor() {
    super('opendevin');
  }
}

const INSTALLER_REGISTRY: Record<AgentId, RuntimeInstaller> = {
  claude: new ClaudePluginInstaller(),
  codex: new CodexInstaller(),
  roo: new RooInstaller(),
  cursor: new CursorInstaller(),
  cline: new ClineInstaller(),
  continue: new ContinueInstaller(),
  gemini: new GeminiInstaller(),
  openclaw: new OpenClawInstaller(),
  hermes: new HermesInstaller(),
  windsurf: new WindsurfInstaller(),
  opencode: new OpenCodeInstaller(),
  aider: new AiderInstaller(),
  opendevin: new OpenDevinInstaller(),
};

function getInstaller(agent: AgentId): RuntimeInstaller {
  return INSTALLER_REGISTRY[agent];
}

export function getRuntimeCapabilities(): RuntimeCapability[] {
  return [...SUPPORTED_RUNTIME_CAPABILITIES];
}

export function resolveInstallTarget(agent: AgentId): InstallTarget {
  return getInstaller(agent).buildTarget();
}

export function listSupportedAgents(): AgentId[] {
  return [...AGENTS];
}

export function installActivationArtifacts(agent: AgentId, options: InstallOptions = {}): InstallResult {
  const target = resolveInstallTarget(agent);
  const dryRun = !!options.dryRun;
  const written: string[] = [];

  if (!dryRun) {
    ensureDir(target.dir);
  }

  for (const file of target.files) {
    const fullPath = path.join(target.dir, file.name);
    if (!dryRun) {
      writeFileSafe(fullPath, file.content);
    }
    written.push(fullPath);
  }

  return {
    agent: target.agent,
    dir: target.dir,
    written,
    dryRun,
  };
}

export function installActivationArtifactsForAll(options: InstallOptions = {}): InstallResult[] {
  return AGENTS.map(agent => installActivationArtifacts(agent, options));
}

function getStatePath(dataDir = DEFAULT_DATA_DIR): string {
  return path.resolve(dataDir, 'activation-state.json');
}

function getStatsPath(dataDir = DEFAULT_DATA_DIR): string {
  return path.resolve(dataDir, 'activation-stats.json');
}

function defaultState(): ActivationState {
  return {
    enabled: false,
    mode: 'token-saving',
    conciseReplies: true,
    duplicateDetection: true,
    cacheGuidance: true,
    compressedLogs: true,
    summarizeStackTraces: true,
    updatedAt: Date.now(),
  };
}

function defaultStats(): ActivationStats {
  return {
    activated_count: 0,
    deactivated_count: 0,
    last_activated_at: null,
    last_deactivated_at: null,
  };
}

export function getActivationState(dataDir = DEFAULT_DATA_DIR): ActivationState {
  const p = getStatePath(dataDir);
  return readJsonFile<ActivationState>(p, defaultState());
}

export function getActivationStats(dataDir = DEFAULT_DATA_DIR): ActivationStats {
  const p = getStatsPath(dataDir);
  return readJsonFile<ActivationStats>(p, defaultStats());
}

export function setActivationState(mode: ActivateMode, dataDir = DEFAULT_DATA_DIR): ActivationState {
  const state = getActivationState(dataDir);
  const stats = getActivationStats(dataDir);
  const now = Date.now();

  state.enabled = mode === 'on';
  state.updatedAt = now;

  if (mode === 'on') {
    stats.activated_count += 1;
    stats.last_activated_at = now;
  } else {
    stats.deactivated_count += 1;
    stats.last_deactivated_at = now;
  }

  const statePath = getStatePath(dataDir);
  const statsPath = getStatsPath(dataDir);
  ensureDir(path.dirname(statePath));
  writeFileSafe(statePath, JSON.stringify(state, null, 2));
  writeFileSafe(statsPath, JSON.stringify(stats, null, 2));

  return state;
}

export function formatActivationEnabledMessage(): string {
  return [
    'TokenKlaw active.',
    'Context reduction: on',
    'Duplicate detection: on',
    'Cache guidance: on',
    'Verbose replies: reduced',
    'Token-saving mode: enabled',
  ].join('\n');
}

export function formatActivationDisabledMessage(): string {
  return [
    'TokenKlaw inactive.',
    'Context reduction: off',
    'Duplicate detection: off',
    'Cache guidance: off',
    'Verbose replies: default',
    'Token-saving mode: disabled',
  ].join('\n');
}