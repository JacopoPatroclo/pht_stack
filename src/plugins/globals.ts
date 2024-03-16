import sensible from '@fastify/sensible';
import fp from 'fastify-plugin';
import multypart from '@fastify/multipart';
import formbody from '@fastify/formbody';
import kitaHtmlPlugin from '@kitajs/fastify-html-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    isHtmx: () => boolean;
  }
}

/**
 * This plugin will add some globals plugins necessary for the application
 * to work:
 * - @kitajs/fastify-html-plugin
 * - @fastify/sensible
 * - @fastify/multipart
 * - @fastify/formbody
 *
 * It will also add the following utility:
 * - isHtmxRequest: A function that return true if the request is an htmx request
 */
export default fp(async (fastify) => {
  fastify.register(kitaHtmlPlugin);
  fastify.register(sensible);
  fastify.register(formbody);
  fastify.register(multypart, {
    // This will allow to validate the body content with @sinclair/typebox
    attachFieldsToBody: 'keyValues',
    // Set here the limits for the file size and the number of fields
    // limits: {}
    limits: {
      // 500MB
      fileSize: 500 * 1024 * 1024,
    },
  });

  // Utility to check if the request is an htmx request
  fastify.decorateRequest('isHtmx', function () {
    return this.headers['hx-request'] === 'true';
  });
});
