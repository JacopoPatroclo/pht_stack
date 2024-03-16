import { FastifyInstance } from 'fastify';
import fStatic from '@fastify/static';
import { join } from 'path';

/**
 * This plugin will add the static plugin to serve the public folder
 * If you want to serve the static files from a cdn in prod you can enable
 * this only in development
 */
export default async function (fastify: FastifyInstance) {
  fastify.register(fStatic, {
    root: join(__dirname, '..', '..', 'public'),
    prefix: '/public/',
  });
}
