import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { Layout } from '../components';
import { WithRoutesAndPluginsCommonOptions } from '../app';
import { e } from '@kitajs/html';

// You can delete this, it's just an example
export const homepage: FastifyPluginAsyncTypebox<
  WithRoutesAndPluginsCommonOptions
> = async (app) => {
  app.get('/', async (request, reply) => {
    const isHtmxRequest = request.headers['hx-request'] === 'true';
    const successMessage = reply.flash('successes.0');
    const hasError = reply.flash('genericErrors.0');

    return reply.html(
      <Layout title="Hello World" isHtmxRequest={isHtmxRequest}>
        <div class="flex flex-col gap-3">
          <h1 class="text-3xl font-bold underline">Hello World!!</h1>
          <div id="upload-for-container" class="flex flex-col gap-3">
            <form
              id="upload-form"
              hx-select="#upload-for-container"
              hx-target="#upload-for-container"
              hx-swap="outerHTML"
              hx-post="/upload"
              enctype="multipart/form-data"
            >
              <label for="name" class="text-sm mr-2">
                Name
              </label>
              <input type="text" name="name" />
            </form>
            <input form="upload-form" type="file" name="somefile" />
            {successMessage && (
              <div class="bg-green-200 p-3 rounded-md text-green-800">
                {e`${successMessage}`}
              </div>
            )}
            {hasError && (
              <div class="bg-red-200 p-3 rounded-md text-red-800">
                {e`${hasError}`}
              </div>
            )}
            <button
              form="upload-form"
              class="bg-teal-500 rounded-md text-white px-3 py-1 hover:bg-teal-600 transition-colors mr-auto"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </Layout>,
    );
  });

  // An example on how to handle file uploads
  app.post(
    '/upload',
    {
      schema: {
        body: Type.Object({
          name: Type.String({ minLength: 5 }),
          somefile: Type.Optional(Type.Unsafe<Buffer>()),
        }),
      },
      errorHandler: (error, request, reply) => {
        request.flash('genericErrors', [error.message]);
        return reply.redirect('/');
      },
    },
    async (request, reply) => {
      // Here you have access to the validated name file
      // and if it's there the file buffer
      request.flash('successes', ['File uploaded successfully']);
      return reply.redirect('/');
    },
  );
};

export default homepage;
