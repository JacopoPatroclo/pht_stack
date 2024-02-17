# PHT Stack

P stands for Postgres, H stands for HTMX, and T stands for Typescript. Fastify is hidden but is there. This is a stack for developing fast web applications.
You can write your template with JSX to have a composable and type-safe way to write your views.

## Project Structure

- `src` contains the source code for the server
  - `components` contains the components that are used globally
  - `database` contains the database connection and the drizzle tables definitions
  - `plugins` contains the plugins that are used globally (registered automatically)
  - `routes` contains the routes files (registered automatically)
  - `env.ts` validate and expose environment variables
  - `app.ts` is the file that creates the server (see builder pattern in Fastify documentation)
  - `index.ts` is the entry point of the server
  - `main.css` is the main CSS file used by Tailwind CSS
- `client` contains the client code, each TypeScript file in this directory will be used as an entry point for the client scripts. The output will be placed in the `public/dist` directory.
- `public` contains the public files that are served by the server
- `migrations` contains the database migrations generated by Drizzle
- `build.mjs` a small script to orchestrate the build process, it handles the client and server builds, Tailwind CSS, the node dev server, and the Docker Compose up command
- `drizzle.cofig.ts` the configuration file for Drizzle
- `cypress.config.ts` the configuration file for Cypress
- `e2e.mjs` the script to orchestrated the end-to-end tests run by Cypress, you should use this on CI. Locally you can use the Cypress GUI

## Technologies

This project uses the following technologies:

- [Fastify](https://fastify.io) as the server
- [Drizzle](https://orm.drizzle.team) as the ORM
- [HTMX](https://htmx.org/) as the client-side library
- [Tailwind CSS](https://tailwindcss.com/) as the CSS framework
- [Postgres](https://www.postgresql.org/) as the database (replaceable)
- [Typescript](https://www.typescriptlang.org) as the language
- [Esbuild](https://esbuild.github.io/) as the bundler
- [Node.js](https://nodejs.org) as the runtime and test runner
- [Cypress](https://www.cypress.io/) as the end-to-end test runner
- [@kitajs/html](https://github.com/kitajs/html) for the JSX templating

Make sure to check the documentation of each technology to understand how to use them.

## Development

This project uses `pnpm` as the package manager. To install the dependencies, run `pnpm install`.
To start the development server, run

```sh
pnpm dev
```

To run the unit tests, run

```sh
pnpm test
```

To build for production, run

```sh
pnpm build
```

To run the type check and lint, run

```sh
pnpm typecheck
pnpm lint
```

There is a check command to run various check commands at once.
See package.json for more details.

```sh
pnpm check
```

To run the end-to-end tests, run

```sh
pnpm e2e
```

## Deployment

This section varies depending on the deployment platform. There is a Dockerfile that you can use to create a container. The container will serve the application on port 3000. You can build it like this:

```sh
docker build -t pht-stack .
```

After that, you can push that container to a container registry and deploy it to your platform of choice.

## E2E Tests

This project uses Cypress for end-to-end tests. Locally, while developing your app you should start the dev serve into one terminal and run the Cypress GUI in another terminal. To do that, run:

```sh
pnpm dev
```

```sh
pnpm cypress open
```

This will open the Cypress GUI where you can run the tests. You can also run the tests in headless mode by running:

```sh
pnpm e2e
```

## Use another database

To use another database, you need to go into the package.json and remove the current driver dependencies, installing the one that you want to use with Drizzle. Afterward, you need to update the [database.ts file](src/database/database.ts) with the new way of creating the SQL client (changing the content of the function `makeSqlClient`). The last thing you need to do is to update the [Drizzle config file](drizzle.config.ts) with the new driver and connection parameters if needed.
