import fp from 'fastify-plugin';
import secureSession from '@fastify/secure-session';
import flash from '@fastify/flash';
// This is needed because @fastify/flash does not export types by default
import '@fastify/flash/lib/@types/fastify';
import { WithRoutesAndPluginsCommonOptions } from '../app';

export default fp(async (fastify, opts: WithRoutesAndPluginsCommonOptions) => {
  await fastify.register(secureSession, {
    key: Buffer.from(opts.env.COOKIE_SECRET, 'hex'),
    cookie: {
      httpOnly: true,
      secure: opts.env.ENVIROMENT === 'production',
      // 1 week
      maxAge: opts.env.SESSION_DURATION,
    },
  });

  fastify.register(flash);
});
