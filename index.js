#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  const output = execSync('npx ccusage daily --json --breakdown', { encoding: 'utf8' });
  console.log(output);
} catch (error) {
  console.error('Error running ccusage command:', error.message);
  process.exit(1);
}