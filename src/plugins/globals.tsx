import { e } from '@kitajs/html';
import sensible from '@fastify/sensible';
import fp from 'fastify-plugin';
import multypart from '@fastify/multipart';
import formbody from '@fastify/formbody';
import kitaHtmlPlugin from '@kitajs/fastify-html-plugin';

import { Layout } from '../components';
import { WithRoutesAndPluginsCommonOptions } from '../app';

export default fp(async (fastify, opts: WithRoutesAndPluginsCommonOptions) => {
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

  // Global error handler, we want to return alaways a 200 status code and html
  fastify.setErrorHandler((error, request, reply) => {
    const ishtmxReques = request.headers['hx-request'] === 'true';
    reply.status(200).html(
      <Layout title="Something bad happend" isHtmxRequest={ishtmxReques}>
        <div class="flex flex-col gap-2">
          <h1 class="text-xl">Something bad happend!!</h1>
          <p class="text-l">{e`Error code: ${error.code}`}</p>
          {/* We do not want to expose the stack trace if we are in production */}
          {opts.env.ENVIROMENT !== 'production' && (
            <pre class="text-slate-800">{e`${error.stack}`}</pre>
          )}
        </div>
      </Layout>,
    );
  });
});
