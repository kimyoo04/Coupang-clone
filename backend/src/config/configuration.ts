export default () => ({
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'postgres',
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_kimyoo',
});
