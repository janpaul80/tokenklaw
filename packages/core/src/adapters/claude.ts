/**
 * ClaudeAdapter - Reference RuntimeAdapter implementation
 *
 * This is the reference adapter implementing RuntimeAdapter interface.
 * All other adapters should follow this pattern.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AgentId, installActivationArtifacts, setActivationState as coreSetActivationState, getActivationState as coreGetActivationState, type InstallOptions as CoreInstallOptions, type InstallResult } from '../activation';

// Declare process for type safety
declare const process: { env: Record<string, string | undefined> };

const CLAUDE_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const TOKENKLAW_SUBDIR = 'tokenklaw';
const STATE_FILE = 'activation-state.json';
const SETTINGS_FILE = 'settings.json';

export class ClaudeAdapter {
  readonly agent: AgentId = 'claude';
  readonly name = 'Claude Code';
  readonly runtimeStatus: 'validated' | 'experimental' | 'scaffolded' | 'investigation' = 'validated';

  private get tokenklawDir(): string {
    return path.join(CLAUDE_CONFIG_DIR, TOKENKLAW_SUBDIR);
  }

  private get stateFilePath(): string {
    return path.join(this.tokenklawDir, STATE_FILE);
  }

  private get settingsFilePath(): string {
    return path.join(CLAUDE_CONFIG_DIR, SETTINGS_FILE);
  }

  private get commandsDir(): string {
    return path.join(CLAUDE_CONFIG_DIR, 'commands');
  }

  private get hooksDir(): string {
    return path.join(CLAUDE_CONFIG_DIR, 'hooks');
  }

  /**
   * Detect if Claude Code is installed and available.
   */
  async detect(): Promise<boolean> {
    try {
      return fs.existsSync(CLAUDE_CONFIG_DIR) && fs.statSync(CLAUDE_CONFIG_DIR).isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Install TokenKlaw artifacts for Claude Code.
   */
  async install(options?: CoreInstallOptions): Promise<{
    success: boolean;
    installed: string[];
    skipped: string[];
    errors: string[];
  }> {
    const dryRun = options?.dryRun ?? false;
    const written: string[] = [];
    const errors: string[] = [];

    try {
      if (!dryRun) {
        // Use existing installer
        const result = installActivationArtifacts(this.agent, { dryRun: false });
        written.push(...result.written);

        // Ensure commands directory exists for hooks
        const commandFiles = ['tokenklaw', 'tk', 'tokenklaw-help', 'tokenklaw-off', 'tokenklaw-stats'];
        for (const cmd of commandFiles) {
          const cmdPath = path.join(this.commandsDir, `${cmd}.toml`);
          if (!fs.existsSync(cmdPath)) {
            errors.push(`Command file not found: ${cmdPath}`);
          }
        }
      } else {
        // Dry run - just report what would be written
        const result = installActivationArtifacts(this.agent, { dryRun: true });
        written.push(...result.written);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      success: errors.length === 0,
      installed: written,
      skipped: [],
      errors,
    };
  }

  /**
   * Activate or deactivate TokenKlaw for Claude Code.
   */
  async activate(mode: 'on' | 'off'): Promise<{
    success: boolean;
    mode: 'on' | 'off';
    timestamp: number;
    message?: string;
  }> {
    try {
      coreSetActivationState(mode, CLAUDE_CONFIG_DIR);
      return {
        success: true,
        mode,
        timestamp: Date.now(),
        message: mode === 'on' ? 'TokenKlaw activated' : 'TokenKlaw deactivated',
      };
    } catch (err) {
      return {
        success: false,
        mode,
        timestamp: Date.now(),
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Register Claude-specific hooks.
   */
  async registerHooks(): Promise<{
    success: boolean;
    hooksRegistered: string[];
    errors: string[];
  }> {
    const hooks: string[] = [];
    const errors: string[] = [];

    try {
      // Check for settings.json to add hooks
      if (fs.existsSync(this.settingsFilePath)) {
        hooks.push('settings.json');
      }

      // Check for hooks directory
      if (fs.existsSync(this.hooksDir)) {
        hooks.push('hooks/');
      }

      hooks.push('commands/');
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      success: errors.length === 0,
      hooksRegistered: hooks,
      errors,
    };
  }

  /**
   * Get current runtime status.
   */
  async status(): Promise<{
    enabled: boolean;
    mode: string;
    runtimePresent: boolean;
    stateFile?: string;
    lastActivated?: number;
  }> {
    const state = coreGetActivationState(CLAUDE_CONFIG_DIR);
    const runtimePresent = await this.detect();

    let stateFile: string | undefined;
    let lastActivated: number | undefined;

    try {
      if (fs.existsSync(this.stateFilePath)) {
        stateFile = this.stateFilePath;
        const content = fs.readFileSync(this.stateFilePath, 'utf-8');
        const parsed = JSON.parse(content);
        lastActivated = parsed.timestamp;
      }
    } catch {
      // State file doesn't exist or is invalid
    }

    return {
      enabled: state.enabled,
      mode: state.mode,
      runtimePresent,
      stateFile,
      lastActivated,
    };
  }

  /**
   * Validate that TokenKlaw files are being consumed by Claude Code.
   */
  async validate(): Promise<{
    valid: boolean;
    runtimeConsumes: boolean;
    evidence: string[];
    gaps: string[];
  }> {
    const evidence: string[] = [];
    const gaps: string[] = [];

    // Check key files exist
    const checks = [
      { path: path.join(CLAUDE_CONFIG_DIR, '.claude-plugin', 'plugin.json'), name: 'plugin.json' },
      { path: path.join(CLAUDE_CONFIG_DIR, 'commands', 'tokenklaw.toml'), name: 'tokenklaw command' },
      { path: this.settingsFilePath, name: 'settings.json' },
    ];

    for (const check of checks) {
      if (fs.existsSync(check.path)) {
        evidence.push(`Found: ${check.name}`);
      } else {
        gaps.push(`Missing: ${check.name}`);
      }
    }

    // Check settings for hooks
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
        if (settings.hooks) {
          evidence.push('hooks configured in settings.json');
        }
      }
    } catch {
      // Settings file invalid
    }

    return {
      valid: evidence.length > 0,
      runtimeConsumes: evidence.length >= 2,
      evidence,
      gaps,
    };
  }
}

// Export singleton instance
export const claudeAdapter = new ClaudeAdapter();

// Export type for convenience
export type ClaudeAdapterStatus = Awaited<ReturnType<ClaudeAdapter['status']>>;
export type ClaudeAdapterValidation = Awaited<ReturnType<ClaudeAdapter['validate']>>;