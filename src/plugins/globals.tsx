import { e } from '@kitajs/html';
import sensible from '@fastify/sensible';
import fp from 'fastify-plugin';
import kitaHtmlPlugin from '@kitajs/fastify-html-plugin';
import { Layout } from '../components';

export default fp(async (fastify) => {
  fastify.register(kitaHtmlPlugin);
  fastify.register(sensible);

  // Global error handler, we want to return alaways a 200 status code and html
  fastify.setErrorHandler((error, request, reply) => {
    const ishtmxReques = request.headers['hx-request'] === 'true';
    reply.status(200).html(
      <Layout title="Something bad happend" isHtmxRequest={ishtmxReques}>
        <div class="flex flex-col gap-2">
          <h1 class="text-xl">Something bad happend</h1>
          <p class="text-l">{e`Error code: ${error.code}`}</p>
          <pre class="text-slate-800">{e`${error.stack}`}</pre>
        </div>
      </Layout>,
    );
  });
});
