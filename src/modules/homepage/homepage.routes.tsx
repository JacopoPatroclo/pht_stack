import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { Layout } from '../../components';
import { WithRoutesAndPluginsCommonOptions } from '../../app';
import { e } from '@kitajs/html';

// You can delete this, it's just an example
export const homepage: FastifyPluginAsyncTypebox<
  WithRoutesAndPluginsCommonOptions
> = async (app) => {
  app.get('/', async (request, reply) => {
    const isHtmxRequest = request.isHtmx();
    const successMessage = reply.flash('successes.0');
    const hasError = reply.flash('genericErrors.0');

    return reply.html(
      <Layout title="PHT Stack" isHtmxRequest={isHtmxRequest}>
        <div class="flex flex-col gap-3 p-14">
          <div class="text-5xl font-extrabold ml-auto mr-auto">
            <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Hello World!! 🚀
            </h1>
          </div>
          <p class="text-lg text-blue-900">TECH INVOLVED:</p>
          <ul class="list-disc pl-7">
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://fastify.io"
              >
                Fastify
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://orm.drizzle.team"
              >
                Drizzle
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://htmx.org/"
              >
                HTMX
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://tailwindcss.com/"
              >
                Tailwind CSS
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://www.postgresql.org/"
              >
                Postgres
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://www.typescriptlang.org"
              >
                Typescript
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://esbuild.github.io/"
              >
                Esbuild
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://nodejs.org"
              >
                Node.js
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://www.cypress.io/"
              >
                Cypress
              </a>
            </li>
            <li>
              <a
                class="hover:underline underline-offset-1 text-blue-500"
                href="https://github.com/kitajs/html"
              >
                @kitajs/html
              </a>
            </li>
          </ul>
          <p class="text-lg text-blue-900">HERE A FORM EXAMPLE</p>
          <div id="upload-for-container" class="flex flex-col gap-3">
            <form
              id="upload-form"
              hx-select="#upload-for-container"
              hx-target="#upload-for-container"
              hx-swap="outerHTML"
              hx-post="/upload"
              enctype="multipart/form-data"
            >
              <label for="name" class="text-sm mr-2 text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </form>
            <input
              class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              form="upload-form"
              type="file"
              name="somefile"
            />
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
