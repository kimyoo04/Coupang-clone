import { registerAs } from '@nestjs/config';

export default registerAs('env', () => ({
  secret: process.env.ENVIRONMENT || 'development',
}));
