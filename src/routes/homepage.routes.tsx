import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { Layout } from '../components';
import { WithRoutesAndPluginsCommonOptions } from '../app';

// You can delete this, it's just an example
export const homepage: FastifyPluginAsyncTypebox<
  WithRoutesAndPluginsCommonOptions
> = async (app) => {
  app.get('/', async (_, reply) => {
    return reply.html(
      <Layout title="Hello World">
        <h1 class="text-3xl font-bold underline">Hello World!!</h1>
        <form
          hx-boost="true"
          method="post"
          action="/upload"
          enctype="multipart/form-data"
        >
          <input type="text" name="name" />
          <input type="file" name="somefile" />
          <button type="submit">Submit</button>
        </form>
      </Layout>,
    );
  });

  // An example on how to handle file uploads
  app.post(
    '/upload',
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          somefile: Type.Optional(Type.Unsafe<Buffer>()),
        }),
      },
    },
    async (_, reply) => {
      // Here you have access to the validated name file
      // and if it's there the file buffer
      return reply.html(
        <Layout title="Hello World">
          <h1 class="text-3xl font-bold underline">Upload done</h1>
          <a hx-boost="true" href="/">
            Go back
          </a>
        </Layout>,
      );
    },
  );
};

export default homepage;
