import fp from 'fastify-plugin';
import secureSession from '@fastify/secure-session';
import flash from 'fastify-better-flash';
import { WithRoutesAndPluginsCommonOptions } from '../app';

// Declare here the messages that you want to send over the flash
// library
declare module 'fastify-better-flash' {
  export interface FlashSessionType {
    successes: string[];
    genericErrors: string[];
    validations: Record<string, string[]>;
  }
}

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
