import '@kitajs/html/register';
import fastify, { FastifyServerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { makeDrizzle, makeSqlClient } from './database';
import { readEnv } from './env';

export interface AppConfig {
  sqlClient: ReturnType<typeof makeSqlClient>;
  env: ReturnType<typeof readEnv>;
}

// Type to describe the options that all the routes will recive
export type WithRoutesCommonOptions<T = unknown> = T & {
  drizzle: ReturnType<typeof makeDrizzle>;
  env: ReturnType<typeof readEnv>;
};

/*
 * Build the application registering all the routes and plugins
 */
export function build(appOptions: FastifyServerOptions & AppConfig) {
  const { sqlClient, env, ...opts } = appOptions;
  const app = fastify(opts);
  const drizzle = makeDrizzle(sqlClient);

  // Register all the plugins
  app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  });

  // This is the common options that will be passed to all routes
  const commonOptions: WithRoutesCommonOptions = {
    drizzle,
    env,
  };

  // Register all the routes
  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    // Pick up only the files that ends with .route.js
    matchFilter: /^.+.routes.js$/,
    options: commonOptions,
  });

  return app;
}
