import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { BoardModule } from './board/board.module';
import { LoggingMiddleware } from './middleware/logging-middleware';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, jwtConfig],
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
        };
        // 주의! development 환경에서만 개발 편의성을 위해 활용
        if (configService.get('NODE_ENV') === 'development') {
          console.info('Sync TypeORM');
          obj = Object.assign(obj, {
            synchronize: true,
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
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
