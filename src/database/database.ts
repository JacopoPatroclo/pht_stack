import { MigrationConfig } from 'drizzle-orm/migrator';
import * as schema from './tables';

// If you need to switch out postgres for another SQL client,
// you can do so here by updating this import and using another client
// remember to update the makeSqlClient function to return the new client
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Remove this import if you want to use another SQL client
// remember to delete from the package.json the postgres and pg dependency
// remember also to update the drizzle.config.ts file
import postgres from 'postgres';

// Create a new SQL client
export function makeSqlClient(
  url: string,
  options?: postgres.Options<NonNullable<unknown>>,
) {
  // You can remove the postgres dependency and use another client
  // if you need to not use postgres
  return postgres(url, options);
}

/*
 * Execute the database migrations
 */
export async function migrateDatabase(
  url: string,
  migrationOptions: MigrationConfig,
) {
  // If you are using another client, you can remove the postgres dependency
  const client = makeSqlClient(url, { max: 1 });
  await migrate(drizzle(client), migrationOptions);
}

/*
 * Create a new drizzle instance
 */
export function makeDrizzle(sqlClient: ReturnType<typeof makeSqlClient>) {
  return drizzle(sqlClient, { schema });
}
