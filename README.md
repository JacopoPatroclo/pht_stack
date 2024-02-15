# PHT Stack

P stands for Postgres, H stands for HTMX and T stands for Typescript. Fastify is hidden but is there. This is a stack for developing fast web applications.

## Project Structure

- `src` contains the source code for the server
  - `components` contains the components that are used globally
  - `database` contains the database connection and the drizzle tables definitions
  - `plugins` contains the plugins that are used globally (registered automatically)
  - `routes` contains the routes files (registered automatically)
  - `app.ts` is the file that creates the server (see builder pattern in fastify documentation)
  - `index.ts` is the entry point of the server
  - `main.css` it the main css file used by tailwindcss
- `client` contains the client code, each ts file in this directory will be used as an entry point for the client scripts. The output will be in the `public/dist` directory.

## Development

This project uses `pnpm` as package manager. To install the dependencies, run `pnpm install`.
To start the development server, run `pnpm dev`.
To run the unit tests, run `pnpm test`.
To build for production, run `pnpm build`.
To run the typecheck and lint, run `pnpm typecheck`.
