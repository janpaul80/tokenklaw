#!/usr/bin/env node
/**
 * CodexAdapter Verification Script
 */

import { codexAdapter } from '../packages/core/src/adapters/codex';

async function verify() {
  console.log('=== CodexAdapter Verification ===\n');

  // Test 1: Detect
  console.log('[1] detect()...');
  const detected = await codexAdapter.detect();
  console.log(`    Codex detected: ${detected}`);

  // Test 2: Validate
  console.log('\n[2] validate()...');
  const validation = await codexAdapter.validate();
  console.log(`    valid: ${validation.valid}`);
  console.log(`    runtimeConsumes: ${validation.runtimeConsumes}`);
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

  // Test 3: Status
  console.log('\n[3] status()...');
  const status = await codexAdapter.status();
  console.log(`    runtime present: ${status.runtimePresent}`);

  // Test 4: Install
  console.log('\n[4] install()...');
  const install = await codexAdapter.install();
  console.log(`    success: ${install.success}`);
  console.log(`    installed: ${install.installed.length} files`);

  console.log('\n=== Verification Complete ===');
}

verify().catch(console.error);