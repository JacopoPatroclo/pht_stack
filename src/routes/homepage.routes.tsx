import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Layout } from '../components';
import { WithRoutesCommonOptions } from '../app';

// You can delete this, it's just an example
export const homepage: FastifyPluginAsyncTypebox<
  WithRoutesCommonOptions
> = async (app) => {
  app.get('/', async (_, reply) => {
    return reply.html(
      <Layout title="Hello World">
        <h1 class="text-3xl font-bold underline">Hello World!!</h1>
      </Layout>,
    );
  });
};

export default homepage;
