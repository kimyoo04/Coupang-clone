export default () => ({
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_DATABASE: process.env.DB_DATABASE || 'postgres',
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
});
