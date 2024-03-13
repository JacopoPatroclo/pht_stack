import type { FastifyServerOptions } from 'fastify';
import { join } from 'path';
import { build } from './app';
import { makeSqlClient, migrateDatabase } from './database';
import { readEnv } from './env';
import closeWithGrace from 'close-with-grace';

// Read the environment variables
const env = readEnv();
// Create the sql client
const sqlClient = makeSqlClient(env.DATABASE_URL);

// Setup the logger roules
let logger: FastifyServerOptions['logger'] = true;
if (process.stdin.isTTY) {
  // If the process is running in a TTY (terminal) then use the pretty logger
  logger = {
    transport: {
      target: 'pino-pretty',
    },
  };
}

// Get the application instance from the builder
const app = build({
  logger,
  sqlClient,
  env,
});

// Setup close with grace in order to close the application gracefully
const closeListener = closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    app.log.error(err);
  }
  await app.close();
});

// When the server close, remove the closeWithGrace listener
app.addHook('onClose', (_, done) => {
  closeListener.close();
  done();
});

// When the app is ready
app
  .ready()
  .then(() =>
    // Migrate the database automatically
    migrateDatabase(env.DATABASE_URL, {
      migrationsFolder: join(__dirname, '..', 'migrations'),
    }),
  )
  .then(() =>
    // Start the server
    app.listen({
      port: env.PORT,
      host: env.HOST,
    }),
  )
  .then(() => {
    const address = app.server?.address();
    if (address && typeof address !== 'string')
      app.log.info(`Server listening on ${address.address}:${address.port}`);
  });
