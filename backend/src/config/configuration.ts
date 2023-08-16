export default () => ({
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',

  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_NAME: process.env.POSTGRES_NAME || 'postgres',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT) || 5434,
  POSTGRES_DB: process.env.POSTGRES_DB || 'postgres',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',

  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_kimyoo',
});
