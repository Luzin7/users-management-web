import { z } from 'zod';

const envSchema = z.object({
  VITE_ENV: z.enum(['development', 'production']).default('production'),
});

type EnvSchema = z.infer<typeof envSchema>;
const _env = envSchema.safeParse(import.meta.env);

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.flatten());
  throw new Error('Invalid environment variables');
}

const env: EnvSchema = _env.data;
export { env };
