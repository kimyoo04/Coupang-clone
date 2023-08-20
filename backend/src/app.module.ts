import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { BoardModule } from './board/board.module';
import { LoggingMiddleware } from './middleware/logging-middleware';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';
import envConfig from './config/env.config';
import swaggerConfig from './config/swagger.config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // 60초
      limit: 10, // 10번
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, jwtConfig, envConfig, swaggerConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
        };
        // 주의! development 환경에서만 db 활용
        if (configService.get('ENVIRONMENT') === 'development') {
          console.info('Sync TypeORM');
          obj = Object.assign(obj, {
            logging: true,
          });
        }
        return obj;
      },
    }),
    AuthModule,
    AnalyticsModule,
    BoardModule,
    UserModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
