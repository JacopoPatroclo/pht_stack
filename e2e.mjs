import { exec, execSync } from 'child_process';
import closeWithGrace from 'close-with-grace';

// Stop and restart the Docker containers ensuring an empty database
execSync('docker-compose down --volumes', { shell: true, stdio: null });
execSync('docker-compose up -d', { shell: true, stdio: null });

// Build the app
execSync('pnpm build', { shell: true, stdio: 'inherit' });

// Start the dev server
const devServer = exec('pnpm start', { shell: true, stdio: 'pipe' });

devServer.stdout.pipe(process.stdout);
devServer.stderr.pipe(process.stderr);

// Wait for the dev server to be ready
await new Promise((resolve) => {
  devServer.stdout.on('data', (data) => {
    if (data.includes('Server listening on')) {
      resolve();
    }
  });
});

// Run the e2e tests
const cypress = exec('pnpm cypress run', { shell: true, stdio: 'pipe' });

cypress.stdout.pipe(process.stdout);
cypress.stderr.pipe(process.stderr);

cypress.on('exit', () => {
  // Stop the dev server
  devServer.kill();
});

closeWithGrace({ delay: 500 }, () => {
  cypress.kill();
  devServer.kill();
});
