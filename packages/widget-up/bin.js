#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const { execSync } = require('child_process');
const packageJson = require('./package.json'); // 引入 package.json

// Helper function to run scripts
function runScript(command) {
  execSync(command, { stdio: 'inherit' });
}

program
  .version(packageJson.version) // 使用 package.json 中的版本号
  .description('CLI to bundle widgets using Rollup');

program
  .command('build')
  .description('Builds the widget for production')
  .action(() => {
    console.log('Running clean up...');
    runScript('rimraf dist'); // 直接调用 rimraf 清理 dist 目录
    console.log('Building...');
    runScript('rollup -c');
  });

program
  .command('dev')
  .description('Starts the widget in development mode with watch')
  .action(() => {
    console.log('Starting development server...');
    runScript('rollup -c -w');
  });

program.parse(process.argv);
