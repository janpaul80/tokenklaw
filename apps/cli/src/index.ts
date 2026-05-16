#!/usr/bin/env node
import {spawnSync} from 'child_process';

function usage() {
  console.log('tokenklaw <command>');
  console.log('commands: doctor, inspect, stats, proxy');
}

function runDoctor() {
  console.log('Node:', process.version);
  const pnpm = spawnSync('pnpm', ['--version'], {encoding: 'utf8', shell: true});
  console.log('pnpm:', pnpm.status === 0 ? pnpm.stdout.trim() : 'not found');
  try {
    require('better-sqlite3');
    console.log('better-sqlite3: available');
  } catch {
    console.log('better-sqlite3: missing');
  }
}

const cmd = process.argv[2] || 'help';
switch (cmd) {
  case 'doctor':
    runDoctor();
    process.exit(0);
  case 'inspect':
  case 'stats':
  case 'proxy':
    console.error('command not implemented in initial scaffold');
    process.exit(1);
  default:
    usage();
    process.exit(0);
}
