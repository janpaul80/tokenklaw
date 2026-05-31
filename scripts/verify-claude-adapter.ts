#!/usr/bin/env node
/**
 * ClaudeAdapter Verification Script
 */

import { claudeAdapter } from '../packages/core/src/adapters/claude';

async function verify() {
  console.log('=== ClaudeAdapter Verification ===\n');

  // Test 1: Detect
  console.log('[1] detect()...');
  const detected = await claudeAdapter.detect();
  console.log(`    Claude Code detected: ${detected}`);

  // Test 2: Status
  console.log('\n[2] status()...');
  const status = await claudeAdapter.status();
  console.log(`    enabled: ${status.enabled}`);
  console.log(`    mode: ${status.mode}`);
  console.log(`    runtime present: ${status.runtimePresent}`);

  // Test 3: Validate
  console.log('\n[3] validate()...');
  const validation = await claudeAdapter.validate();
  console.log(`    valid: ${validation.valid}`);
  console.log(`    runtime consumes: ${validation.runtimeConsumes}`);
  console.log(`    evidence: ${validation.evidence.length} items`);
  for (const e of validation.evidence) {
    console.log(`      - ${e}`);
  }
  if (validation.gaps.length > 0) {
    console.log(`    gaps: ${validation.gaps.length} items`);
    for (const g of validation.gaps) {
      console.log(`      - ${g}`);
    }
  }

  // Test 4: Install (dry run)
  console.log('\n[4] install({ dryRun: true })...');
  const install = await claudeAdapter.install({ dryRun: true });
  console.log(`    success: ${install.success}`);
  console.log(`    installed: ${install.installed.length} files`);

  // Test 5: Register hooks
  console.log('\n[5] registerHooks()...');
  const hooks = await claudeAdapter.registerHooks();
  console.log(`    success: ${hooks.success}`);
  console.log(`    hooks registered: ${hooks.hooksRegistered.length}`);

  console.log('\n=== Verification Complete ===');
}

verify().catch(console.error);