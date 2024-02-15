import { Type, Static } from '@sinclair/typebox';
import envValidate from 'env-schema';
import { join } from 'path';

// Define the schema for the environment variables
const envSchema = Type.Object({
  ENVIROMENT: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test'),
  ]),
  PORT: Type.Optional(Type.Number({ default: 3000 })),
  HOST: Type.Optional(Type.String({ default: '0.0.0.0' })),
  DATABASE_URL: Type.String(),
  // Add below your env variables
});

/*
 * You can call this to get the current environment variables
 * This function will throw if an env variable is missing or invalid
 * You should not use this inside your application code, use the options
 * provided to the routes instead
 */
export function readEnv(): Static<typeof envSchema> {
  return envValidate({
    schema: envSchema,
    expandEnv: true,
    dotenv: {
      path: join(__dirname, '..', '.env.local'),
    },
  });
}
