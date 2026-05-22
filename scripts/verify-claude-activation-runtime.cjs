#!/usr/bin/env node
'use strict';

const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const core = require(path.join(root, 'packages/core/dist/activation.js'));

function fileMap(files) {
  return new Map(files.map(file => [file.name.replace(/\\/g, '/'), file.content]));
}

function assertIncludes(map, name) {
  assert.ok(map.has(name), `missing generated artifact: ${name}`);
  return map.get(name);
}

function main() {
  const target = core.resolveInstallTarget('claude');
  const files = fileMap(target.files);

  for (const command of ['tokenklaw', 'tk', 'tokenklaw-help', 'tokenklaw-off']) {
    assertIncludes(files, `commands/${command}.md`);
    assert.ok(!files.has(`commands/${command}.toml`), `legacy TOML command must not be generated: ${command}.toml`);
  }

  const plugin = JSON.parse(assertIncludes(files, '.claude-plugin/plugin.json'));
  assert.equal(plugin.name, 'tokenklaw');
  assert.equal(plugin.displayName, 'TokenKlaw');
  assert.deepEqual(plugin.commands, ['./commands/']);
  assert.deepEqual(plugin.skills, ['./skills/']);
  assert.equal(plugin.hooks, './hooks/hooks.json');
  assert.equal(plugin.entrypoints, undefined, 'legacy entrypoints field must not be generated');

  const marketplace = JSON.parse(assertIncludes(files, '.claude-plugin/marketplace.json'));
  assert.equal(marketplace.name, 'tokenklaw-marketplace');
  assert.equal(marketplace.owner.name, 'TokenKlaw');
  assert.equal(marketplace.plugins[0].name, 'tokenklaw');
  assert.equal(marketplace.plugins[0].source, './');

  const hooks = JSON.parse(assertIncludes(files, 'hooks/hooks.json'));
  assert.ok(Array.isArray(hooks.hooks.UserPromptExpansion), 'UserPromptExpansion hook must be registered');
  const hookCommand = hooks.hooks.UserPromptExpansion[0].hooks[0].command;
  assert.ok(hookCommand.includes('tokenklaw.pre-response.cjs'), 'hook command must invoke executable CJS artifact');
  assertIncludes(files, 'hooks/tokenklaw.pre-response.cjs');
  assertIncludes(files, 'hooks/tokenklaw-statusline.ps1');

  const result = cp.spawnSync(process.execPath, ['-e', assertIncludes(files, 'hooks/tokenklaw.pre-response.cjs')], {
    input: '{"hook_event_name":"UserPromptExpansion","command_name":"tokenklaw","prompt":"/tokenklaw"}',
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `hook exited with ${result.status}: ${result.stderr}`);
  assert.equal(result.stderr, '', 'hook must stay silent on stderr');
  const hookOutput = JSON.parse(result.stdout);
  assert.equal(hookOutput.decision, 'block');
  assert.equal(hookOutput.reason, core.formatActivationEnabledMessage());

  const offResult = cp.spawnSync(process.execPath, ['-e', assertIncludes(files, 'hooks/tokenklaw.pre-response.cjs')], {
    input: '{"hook_event_name":"UserPromptExpansion","command_name":"tokenklaw-off","prompt":"/tokenklaw-off"}',
    encoding: 'utf8',
  });
  assert.equal(offResult.status, 0, `off hook exited with ${offResult.status}: ${offResult.stderr}`);
  const offOutput = JSON.parse(offResult.stdout);
  assert.equal(offOutput.reason, core.formatActivationDisabledMessage());

  const statsResult = cp.spawnSync(process.execPath, ['-e', assertIncludes(files, 'hooks/tokenklaw.pre-response.cjs')], {
    input: '{"hook_event_name":"UserPromptExpansion","command_name":"tokenklaw-stats","prompt":"/tokenklaw-stats"}',
    encoding: 'utf8',
  });
  assert.equal(statsResult.status, 0, `stats hook exited with ${statsResult.status}: ${statsResult.stderr}`);
  const statsOutput = JSON.parse(statsResult.stdout);
  assert.match(statsOutput.reason, /TokenKlaw active:/);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokenklaw-statusline-'));
  fs.writeFileSync(path.join(tempDir, 'activation-state.json'), JSON.stringify({ enabled: true }), 'utf8');
  const statuslinePath = path.join(tempDir, 'tokenklaw-statusline.ps1');
  fs.writeFileSync(statuslinePath, assertIncludes(files, 'hooks/tokenklaw-statusline.ps1'), 'utf8');
  const statuslineResult = cp.spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', statuslinePath],
    {
      env: { ...process.env, TOKENKLAW_DATA_DIR: tempDir },
      encoding: 'utf8',
    }
  );
  assert.equal(statuslineResult.status, 0, `statusline exited with ${statuslineResult.status}: ${statuslineResult.stderr}`);
  assert.equal(statuslineResult.stdout.trim(), '[TOKENKLAW]');

  console.log('claude activation runtime artifacts verified');
}

main();
