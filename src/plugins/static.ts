import { FastifyInstance } from 'fastify';
import fStatic from '@fastify/static';
import { join } from 'path';

export default async function (fastify: FastifyInstance) {
  fastify.register(fStatic, {
    root: join(__dirname, '..', '..', 'public'),
    prefix: '/public/',
  });
}
