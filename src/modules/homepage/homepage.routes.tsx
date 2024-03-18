import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { Layout } from '../../components';
import { WithRoutesAndPluginsCommonOptions } from '../../app';
import { e } from '@kitajs/html';

function MessagesComponent(props: {
  hasError?: string;
  successMessage?: string;
}) {
  return (
    <div id="errors-container">
      {props.successMessage && (
        <div class="bg-green-200 p-3 rounded-md text-green-800">
          {e`${props.successMessage}`}
        </div>
      )}
      {props.hasError && (
        <div class="bg-red-200 p-3 rounded-md text-red-800">
          {e`${props.hasError}`}
        </div>
      )}
    </div>
  );
}

function FormComponent() {
  return (
    <form
      id="upload-form"
      hx-swap-oob="#upload-form"
      hx-select="#errors-container"
      hx-target="#errors-container"
      hx-swap="outerHTML"
      hx-post="/upload"
      enctype="multipart/form-data"
      class="flex flex-col gap-3"
    >
      <label for="name" class="text-sm text-gray-700">
        Name
      </label>
      <input
        id="name-input"
        hx-swap-oob="#name-input"
        type="text"
        name="name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      <input
        id="file-input"
        hx-swap-oob="#file-input"
        class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        form="upload-form"
        type="file"
        name="somefile"
      />
    </form>
  );
}

function CountComponent(props: { submitCount: number }) {
  return (
    <p id="submit-count" hx-swap-oob="#submit-count">
      Successful submit Count {props.submitCount}
    </p>
  );
}

let submitCount = 0;

// You can delete this, it's just an example
export const homepage: FastifyPluginAsyncTypebox<
  WithRoutesAndPluginsCommonOptions
> = async (app) => {
  app.get('/', async (request, reply) => {
    const isHtmxRequest = request.isHtmx();

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
          <p class="text-lg text-blue-900">
            HERE A FORM EXAMPLE THAT'S USE OOB
          </p>
          <div class="flex flex-col gap-3">
            <FormComponent />
            <MessagesComponent />
            <button
              form="upload-form"
              class="bg-teal-500 rounded-md text-white px-3 py-1 hover:bg-teal-600 transition-colors mr-auto"
              type="submit"
            >
              Submit
            </button>
          </div>
          <CountComponent submitCount={submitCount} />
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
        return reply.status(422).html(
          <>
            {/* Show error messages */}
            <MessagesComponent hasError={error.message} />
          </>,
        );
      },
    },
    async (request, reply) => {
      // Here you have access to the validated name file
      // and if it's there the file buffer
      return reply.html(
        <>
          {/* Show success messages */}
          <MessagesComponent successMessage="File uploaded successfully" />
          {/* Increase the submit count */}
          <CountComponent submitCount={++submitCount} />
          {/* We want to reset the form state */}
          <FormComponent />
        </>,
      );
    },
  );
};

export default homepage;
