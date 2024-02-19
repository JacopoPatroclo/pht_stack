import * as esbuild from 'esbuild';
import { readdir, rm, watch as watchNode } from 'fs/promises';
import { execSync, exec, spawn } from 'child_process';
import closeWithGrace from 'close-with-grace';

// aviable options
const watch = process.argv.includes('--watch');
const dev = process.argv.includes('--dev');
const test = process.argv.includes('--test');

// Clean up the dist folders
await rm('./public/dist', { recursive: true }).catch(() => null);
await rm('./dist', { recursive: true }).catch(() => null);

// Context for building the client entrypoints
const entrypointsClient = await readdir('client');
const ctxClient = await esbuild.context({
  entryPoints: entrypointsClient
    .filter((filename) => filename.endsWith('.ts') || filename.endsWith('.tsx'))
    .map((entry) => `client/${entry}`),
  bundle: true,
  minify: true,
  platform: 'browser',
  outdir: 'public/dist',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  sourcemap: dev || test,
  tsconfig: 'tsconfig.client.json',
  sourceRoot: 'client',
  define: {
    'process.env.HOT_RELOAD': String(dev),
  },
});

// Context for transpiling the server code
const ctxServer = await esbuild.context({
  entryPoints: ['src/**/*.ts', 'src/**/*.tsx'],
  bundle: false,
  platform: 'node',
  outdir: 'dist',
  format: 'cjs',
  sourcemap: dev || test,
  tsconfig: test ? 'tsconfig.test.json' : 'tsconfig.app.json',
  sourceRoot: 'src',
});

// Run tests with node test
// we do not need tailwind or client code for tests
if (test) {
  async function execTest() {
    await ctxServer.rebuild();
    const testProcess = spawn('node --test dist', {
      shell: true,
      env: process.env,
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    function waitForTest() {
      return new Promise((res) => {
        testProcess.on('exit', () => {
          res();
        });
      });
    }

    await waitForTest();
  }

  if (watch) {
    // setup the closeWithGrace to dispose the esbuild context
    closeWithGrace({ delay: 100 }, async () => {
      await Promise.all([ctxServer.dispose(), ctxClient.dispose()]);
    });

    const watcher = watchNode('src', { recursive: true });
    await execTest();

    // watch for changes in the src folder
    // and execute the tests again when something happens
    for await (const _ of watcher) {
      // clear the console
      process.stdout.write('\x1Bc');

      // execute the tests again
      await execTest();
    }
    process.exit(0);
  } else {
    await execTest();
    process.exit(0);
  }
}

// Tailwind command to run in the background to bundle the css
const tailwindCommand = `pnpm tailwindcss -i ./src/main.css -o ./public/dist/main.css --minify ${watch || dev ? '--watch' : ''}`;
const tailwind = spawn(tailwindCommand, {
  shell: true,
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

// Handle dev mode
if (dev) {
  if (dev && watch) {
    console.warn(
      '\n[BUILD]: Dev mode does by default is watch mode, you should pass either --dev or --watch, not both\n',
    );
  }

  // spawn the infrastrucutre
  execSync('docker compose up -d', {
    shell: true,
    env: process.env,
    stdio: 'ignore',
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

  // Watch infinitley for changes
  await Promise.all([ctxClient.watch(), ctxServer.watch()]);

  // When this script is killed exit cleanly without leaving any processes running
  closeWithGrace({ delay: 500 }, async () => {
    devServer.kill();
    tailwind.kill();

    // Stop the databse, without removing any volumes
    exec('docker compose down', {
      shell: true,
      env: process.env,
      stdio: null,
    });

    await Promise.all([ctxServer.dispose(), ctxClient.dispose()]);
  });
} else {
  // We can build in watch mode if needed
  if (watch) {
    // Start watching for changes
    await Promise.all[(ctxClient.watch(), ctxServer.watch())];

    closeWithGrace({ delay: 100 }, async () => {
      // we have tailwind in watch mode!!
      tailwind.kill();
      // dipose the esbuild context and watchers
      await Promise.all([ctxServer.dispose(), ctxClient.dispose()]);
    });
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
    // Dispose the esbuild context
    await Promise.all[(ctxClient.dispose(), ctxServer.dispose())];
  }
}
