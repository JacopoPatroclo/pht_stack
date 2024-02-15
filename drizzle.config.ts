import type { Config } from 'drizzle-kit';
import { readEnv } from './src/env';

const env = readEnv();

export default {
  schema: './src/database/tables/index.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
