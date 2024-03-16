import { e } from '@kitajs/html';
import fp from 'fastify-plugin';

import { Layout } from '../components';
import { WithRoutesAndPluginsCommonOptions } from '../app';

/**
 * This plugin will add two global handlers
 * - Error handler
 * - 404 handler
 * You can customize those as you want
 */
export default fp(async (fastify, opts: WithRoutesAndPluginsCommonOptions) => {
  // Global error handler, we want to return alaways a 200 status code and html
  fastify.setErrorHandler((error, request, reply) => {
    reply.status(200).html(
      <Layout title="Something bad happend" isHtmxRequest={request.isHtmx()}>
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

  // handle the 404 error
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).html(
      <Layout title="Not Found" isHtmxRequest={request.isHtmx()}>
        <div class="flex flex-col gap-2">
          <h1 class="text-xl">Not Found</h1>
          <p class="text-l">The page you are looking for does not exist</p>
        </div>
      </Layout>,
    );
  });
});
