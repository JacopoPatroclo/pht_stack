import * as esbuild from 'esbuild';
import { readdir, rm } from 'fs/promises';
import { execSync, exec, spawn } from 'child_process';

const watch = process.argv.includes('--watch');
const test = process.argv.includes('--test');

// Clean up the dist folders
await rm('./public/dist', { recursive: true }).catch(() => null);
await rm('./dist', { recursive: true }).catch(() => null);

// Context for building the client entrypoints
const entrypointsClient = await readdir('client');
const ctxClient = await esbuild.context({
  entryPoints: entrypointsClient
    .filter((filename) => filename.endsWith('.ts'))
    .map((entry) => `client/${entry}`),
  bundle: true,
  minify: true,
  platform: 'browser',
  outdir: 'public/dist',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  sourcemap: watch || test,
  tsconfig: 'tsconfig.client.json',
  sourceRoot: 'client',
});

// Context for transpiling the server code
const ctxServer = await esbuild.context({
  entryPoints: ['src/**/*.ts', 'src/**/*.tsx'],
  bundle: false,
  platform: 'node',
  outdir: 'dist',
  format: 'cjs',
  sourcemap: watch || test,
  tsconfig: test ? 'tsconfig.test.json' : 'tsconfig.app.json',
  sourceRoot: 'src',
});

// Tailwind command to run in the background to bundle the css
const tailwindCommand = `pnpm tailwindcss -i ./src/main.css -o ./public/dist/main.css --minify ${watch ? '--watch' : ''}`;
const tailwind = spawn(tailwindCommand, {
  shell: true,
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

if (watch) {
  // spawn the infrastrucutre
  execSync('docker compose up -d', {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  });

  // wait for the database to start
  await new Promise((res) => setTimeout(res, 1000));

  // so we have the dist/index.js file
  await ctxServer.rebuild();

  // Start the dev server in watch mode
  const devServer = spawn('node --watch dist/index.js', {
    shell: true,
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  // When this script is killed exit cleanly without leaving any processes running
  process.on('exit', () => {
    // Stop the databse
    exec('docker compose down', {
      shell: true,
      env: process.env,
      stdio: null,
    });
    devServer.kill();
    tailwind.kill();
    ctxServer.dispose();
    ctxClient.dispose();
  });

  // Watch infinitley for changes
  await Promise.all([ctxClient.watch(), ctxServer.watch()]);
} else {
  // Utility to wait for tailwind to finish
  function waitForTailwind() {
    return new Promise((res) => {
      tailwind.on('exit', () => {
        res();
      });
    });
  }

  // Parallel build client, server and tailwind
  await Promise.all[
    (ctxClient.rebuild(), ctxServer.rebuild(), waitForTailwind())
  ];
  await Promise.all[(ctxClient.dispose(), ctxServer.dispose())];
}
