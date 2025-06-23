#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  // Use the locally installed ccusage
  const ccusagePath = path.join(__dirname, 'node_modules', '.bin', 'ccusage');
  const output = execSync(`${ccusagePath} daily --json --breakdown`, { encoding: 'utf8' });
  console.log(output);
} catch (error) {
  console.error('Error running ccusage command:', error.message);
  process.exit(1);
}