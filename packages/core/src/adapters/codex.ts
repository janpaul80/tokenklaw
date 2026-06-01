/**
 * CodexAdapter - TokenKlaw adapter for Codex CLI
 *
 * CONSUMPTION MODEL DISCOVERED:
 * - Skills: ~/.codex/skills/{skill}/
 * - Rules: ~/.codex/rules/default.rules
 * - Config: ~/.codex/config.toml
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

declare const process: { env: Record<string, string | undefined> };

const CODEX_CONFIG_DIR = process.env.CODEX_CONFIG_DIR || path.join(os.homedir(), '.codex');
const TOKENKLAW_SUBDIR = 'tokenklaw';

export class CodexAdapter {
  readonly agent: 'codex' = 'codex';
  readonly name = 'Codex CLI';
  readonly runtimeStatus: 'scaffolded' | 'investigation' | 'validated' = 'scaffolded';

  private get tokenklawDir(): string {
    return path.join(CODEX_CONFIG_DIR, TOKENKLAW_SUBDIR);
  }

  private get skillsDir(): string {
    return path.join(CODEX_CONFIG_DIR, 'skills');
  }

  private get rulesDir(): string {
    return path.join(CODEX_CONFIG_DIR, 'rules');
  }

  private get configPath(): string {
    return path.join(CODEX_CONFIG_DIR, 'config.toml');
  }

  async detect(): Promise<boolean> {
    try {
      return fs.existsSync(CODEX_CONFIG_DIR) && fs.statSync(CODEX_CONFIG_DIR).isDirectory();
    } catch {
      return false;
    }
  }

  async install(): Promise<{
    success: boolean;
    installed: string[];
    skipped: string[];
    errors: string[];
  }> {
    const installed: string[] = [];
    const errors: string[] = [];

    try {
      // Check if tokenklaw files exist
      if (fs.existsSync(this.tokenklawDir)) {
        const files = fs.readdirSync(this.tokenklawDir);
        installed.push(...files);
      } else {
        errors.push('TokenKlaw not installed in Codex');
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return { success: errors.length === 0, installed, skipped: [], errors };
  }

  async validate(): Promise<{
    valid: boolean;
    runtimeConsumes: boolean;
    evidence: string[];
    gaps: string[];
  }> {
    const evidence: string[] = [];
    const gaps: string[] = [];

    // Evidence: Files exist
    if (fs.existsSync(path.join(this.tokenklawDir, 'tokenklaw.rules.md'))) {
      evidence.push('tokenklaw.rules.md exists');
    }
    if (fs.existsSync(path.join(this.tokenklawDir, 'tokenklaw.skill.md'))) {
      evidence.push('tokenklaw.skill.md exists');
    }

    // Evidence: Codex has system skills (proves skills mechanism works)
    if (fs.existsSync(path.join(this.skillsDir, '.system'))) {
      evidence.push('Codex has system skills (.system/ found)');
    }

    // Evidence: Codex has rules mechanism
    if (fs.existsSync(path.join(this.rulesDir, 'default.rules'))) {
      evidence.push('Codex has rules mechanism');
    }

    // Evidence: Codex has config
    if (fs.existsSync(this.configPath)) {
      evidence.push('Codex config.toml exists');
    }

    // Gaps: Need to verify TokenKlaw files are actually loaded
    const codexLoadsSkills = fs.existsSync(path.join(this.skillsDir, '.codex-system-skills.marker'));
    if (codexLoadsSkills) {
      evidence.push('Codex skill loader marker found');
    } else {
      gaps.push('Cannot verify TokenKlaw skills are loaded by Codex');
    }

    // Key question: Does Codex read ~/.codex/tokenklaw/?
    // Unproven consumption path

    return {
      valid: evidence.length > 0,
      runtimeConsumes: codexLoadsSkills, // Mechanism exists but files unproven
      evidence,
      gaps,
    };
  }

  async status(): Promise<{
    enabled: boolean;
    mode: string;
    runtimePresent: boolean;
    stateFile?: string;
  }> {
    const runtimePresent = await this.detect();
    return {
      enabled: false, // Unknown
      mode: 'unknown',
      runtimePresent,
    };
  }
}

export const codexAdapter = new CodexAdapter();