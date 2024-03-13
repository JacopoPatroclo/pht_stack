import fp from 'fastify-plugin';
import { WithRoutesAndPluginsCommonOptions } from '../app';
import { makeDrizzle } from '../database';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof makeDrizzle>;
  }
}

export default fp(async (fastify, opts: WithRoutesAndPluginsCommonOptions) => {
  const drizzle = makeDrizzle(opts.sql);
  fastify.decorate('db', drizzle);
});
