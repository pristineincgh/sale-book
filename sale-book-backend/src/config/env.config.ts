import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(8000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(64).required(),
});

const envVars = process.env;

export const configuration = () => ({
  env: envVars.NODE_ENV,
  port: envVars.PORT ? parseInt(envVars.PORT, 10) : 8000,
  databaseUrl: envVars.DATABASE_URL,
  cors: {
    origin: envVars.CORS_ORIGIN || '*',
    methods: envVars.CORS_METHODS || 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      envVars.CORS_ALLOWED_HEADERS || 'Content-Type, Authorization',
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
  },
});
