import { exec, execSync } from 'child_process';
import closeWithGrace from 'close-with-grace';

const watch = process.argv.includes('--watch');

// Stop and restart the Docker containers ensuring an empty database
execSync('docker-compose down --volumes', {
  shell: true,
  stdio: null,
  env: process.env,
});
execSync('docker-compose up -d', {
  shell: true,
  stdio: null,
  env: process.env,
});

// Build the app
execSync('pnpm build', { shell: true, stdio: 'inherit', env: process.env });

// Start the dev server
const devServer = exec('pnpm start', {
  shell: true,
  stdio: 'inherit',
  env: process.env,
});

// Wait for the dev server to be ready
await new Promise((resolve) => {
  devServer.stdout.on('data', (data) => {
    if (data.includes('Server listening on')) {
      resolve();
    }
  });
});

// Run the e2e tests
const cypress = exec(`pnpm cypress ${watch ? 'open' : 'run'}`, {
  shell: true,
  stdio: 'inherit',
  env: process.env,
});

cypress.stdout.pipe(process.stdout);
cypress.stderr.pipe(process.stderr);

const timeout = setTimeout(
  () => {
    console.log('Tests have timed out');
    process.exit(0);
  },
  // If 10 minutes have passed, stop the tests
  // This is useful for CI environments
  10 * 60 * 1000,
);

const clgListener = closeWithGrace({ delay: 500 }, () => {
  cypress.kill();
  devServer.kill();
  clearTimeout(timeout);
});

cypress.on('exit', (code) => {
  console.log('Tests have finished with code ' + code);
  // Stop the dev server
  devServer.kill();
  clearTimeout(timeout);
  clgListener.uninstall();
});
