/**
 * TokenKlaw RuntimeAdapter Contract
 *
 * Universal runtime integration interface for AI coding agents.
 * Each adapter implements detection, installation, activation, hooks, status, and validation.
 */

import type { AgentId } from './activation';

/**
 * RuntimeAdapter contract - all runtimes must implement this interface.
 * Claude Code serves as the reference implementation.
 */
export interface RuntimeAdapter {
  /** Unique runtime identifier */
  readonly agent: AgentId;

  /** Human-readable runtime name */
  readonly name: string;

  /** Runtime status */
  readonly runtimeStatus: 'validated' | 'experimental' | 'scaffolded' | 'investigation';

  /**
   * Detect if the runtime is installed and available.
   * @returns Promise<boolean> - whether runtime is detected
   */
  detect(): Promise<boolean>;

  /**
   * Install TokenKlaw artifacts to the runtime.
   * @param options - installation options (dry-run, etc)
   * @returns Promise<InstallResult>
   */
  install(options?: InstallOptions): Promise<InstallResult>;

  /**
   * Activate TokenKlaw for this runtime.
   * @param mode - 'on' or 'off'
   * @returns Promise<ActivationResult>
   */
  activate(mode: 'on' | 'off'): Promise<ActivationResult>;

  /**
   * Register any runtime-specific hooks.
   * @returns Promise<HookResult>
   */
  registerHooks(): Promise<HookResult>;

  /**
   * Get current runtime status.
   * @returns Promise<StatusResult>
   */
  status(): Promise<StatusResult>;

  /**
   * Validate runtime consumption - can TokenKlaw files be consumed?
   * @returns Promise<ValidationResult>
   */
  validate(): Promise<ValidationResult>;
}

/**
 * Installation options
 */
export interface InstallOptions {
  dryRun?: boolean;
  force?: boolean;
  skipExisting?: boolean;
}

/**
 * Installation result
 */
export interface InstallResult {
  success: boolean;
  installed: string[];
  skipped: string[];
  errors: string[];
}

/**
 * Activation result
 */
export interface ActivationResult {
  success: boolean;
  mode: 'on' | 'off';
  timestamp: number;
  message?: string;
}

/**
 * Hook registration result
 */
export interface HookResult {
  success: boolean;
  hooksRegistered: string[];
  errors: string[];
}

/**
 * Status result
 */
export interface StatusResult {
  enabled: boolean;
  mode: string;
  runtimePresent: boolean;
  stateFile?: string;
  lastActivated?: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  runtimeConsumes: boolean;
  evidence: string[];
  gaps: string[];
}

/**
 * Adapter registry - maps AgentId to RuntimeAdapter
 */
export interface AdapterRegistry {
  [agent: string]: RuntimeAdapter;
}

/**
 * Capability flags for runtime adapters
 */
export interface RuntimeAdapterCapabilities {
  /** Does the runtime support detection? */
  canDetect: boolean;

  /** Does the runtime support installation? */
  canInstall: boolean;

  /** Does the runtime support activation? */
  canActivate: boolean;

  /** Does the runtime support hooks? */
  canRegisterHooks: boolean;

  /** Does the runtime support status? */
  canReportStatus: boolean;

  /** Does the runtime support validation? */
  canValidate: boolean;
}

/**
 * RuntimeAdapterFactory - creates adapters for each runtime
 */
export interface RuntimeAdapterFactory {
  /** Create adapter for specific runtime */
  createAdapter(agent: AgentId): RuntimeAdapter;

  /** List all available adapters */
  listAdapters(): RuntimeAdapter[];

  /** Get adapter by agent ID */
  getAdapter(agent: AgentId): RuntimeAdapter | null;
}

/**
 * Built-in adapter capabilities
 */
export const ADAPTER_CAPABILITIES: Record<AgentId, RuntimeAdapterCapabilities> = {
  'claude': {
    canDetect: true,
    canInstall: true,
    canActivate: true,
    canRegisterHooks: true,
    canReportStatus: true,
    canValidate: true,
  },
  'openclaw': {
    canDetect: false,  // Gap: no verified detection path
    canInstall: true,
    canActivate: false,  // Gap: no activation mechanism found
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,  // Gap: no verified consumption
  },
  'hermes': {
    canDetect: false,  // Gap: no verified detection path
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'gemini': {
    canDetect: false,
    canInstall: false,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'opencode': {
    canDetect: false,
    canInstall: false,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'codex': {
    canDetect: false,
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'roo': {
    canDetect: false,
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'cursor': {
    canDetect: false,
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'cline': {
    canDetect: false,
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'continue': {
    canDetect: false,
    canInstall: true,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'windsurf': {
    canDetect: false,
    canInstall: false,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'aider': {
    canDetect: false,
    canInstall: false,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
  'opendevin': {
    canDetect: false,
    canInstall: false,
    canActivate: false,
    canRegisterHooks: false,
    canReportStatus: false,
    canValidate: false,
  },
};

/**
 * Validation matrix - what needs verification for each runtime
 */
export const RUNTIME_ADAPTER_MATRIX: Record<AgentId, {
  label: string;
  runtimeStatus: 'validated' | 'experimental' | 'scaffolded' | 'investigation';
  detectionPath: string | null;
  installTarget: string | null;
  activationMechanism: string | null;
  gaps: string[];
}> = {
  'claude': {
    label: 'Claude Code',
    runtimeStatus: 'validated',
    detectionPath: '~/.claude/',
    installTarget: '~/.claude/tokenklaw/',
    activationMechanism: 'skill',
    gaps: [],
  },
  'openclaw': {
    label: 'OpenClaw',
    runtimeStatus: 'scaffolded',
    detectionPath: '~/.openclaw/',
    installTarget: '~/.openclaw/tokenklaw/',
    activationMechanism: null,
    gaps: ['no detection verified', 'no activation found', 'no consumption verified'],
  },
  'hermes': {
    label: 'Hermes',
    runtimeStatus: 'scaffolded',
    detectionPath: '~/.hermes/',
    installTarget: '~/.hermes/tokenklaw/',
    activationMechanism: null,
    gaps: ['no detection verified', 'no activation found', 'no consumption verified'],
  },
  'gemini': {
    label: 'Gemini / Antigravity',
    runtimeStatus: 'investigation',
    detectionPath: null,
    installTarget: null,
    activationMechanism: null,
    gaps: ['runtime not found', 'no installation path', 'no architecture'],
  },
  'opencode': {
    label: 'OpenCode',
    runtimeStatus: 'investigation',
    detectionPath: null,
    installTarget: null,
    activationMechanism: null,
    gaps: ['runtime not found', 'no installation path', 'no architecture'],
  },
  'codex': {
    label: 'Codex CLI',
    runtimeStatus: 'investigation',
    detectionPath: '~/.codex/',
    installTarget: '~/.codex/tokenklaw/',
    activationMechanism: 'config',
    gaps: ['TokenKlaw writes to wrong path', 'Codex loads from ~/.codex/skills/', 'Need to verify consumption'],
  },
  'roo': {
    label: 'Roo Code',
    runtimeStatus: 'scaffolded',
    detectionPath: null,
    installTarget: '~/.roo/tokenklaw/',
    activationMechanism: 'skill',
    gaps: ['no detection verified', 'no activation mechanism'],
  },
  'cursor': {
    label: 'Cursor',
    runtimeStatus: 'scaffolded',
    detectionPath: null,
    installTarget: '~/.cursor/tokenklaw/',
    activationMechanism: 'prompt-injection',
    gaps: ['no detection verified', 'no activation mechanism'],
  },
  'cline': {
    label: 'Cline',
    runtimeStatus: 'scaffolded',
    detectionPath: null,
    installTarget: '~/.cline/tokenklaw/',
    activationMechanism: 'skill',
    gaps: ['no detection verified', 'no activation mechanism'],
  },
  'continue': {
    label: 'Continue',
    runtimeStatus: 'scaffolded',
    detectionPath: null,
    installTarget: '~/.continue/tokenklaw/',
    activationMechanism: 'config',
    gaps: ['no detection verified', 'no activation mechanism'],
  },
  'windsurf': {
    label: 'Windsurf',
    runtimeStatus: 'investigation',
    detectionPath: null,
    installTarget: null,
    activationMechanism: null,
    gaps: ['not implemented'],
  },
  'aider': {
    label: 'aider',
    runtimeStatus: 'investigation',
    detectionPath: null,
    installTarget: null,
    activationMechanism: null,
    gaps: ['not implemented'],
  },
  'opendevin': {
    label: 'OpenDevin',
    runtimeStatus: 'investigation',
    detectionPath: null,
    installTarget: null,
    activationMechanism: null,
    gaps: ['not implemented'],
  },
};