import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { BoardModule } from './board/board.module';
import { LoggingMiddleware } from './middleware/logging-middleware';
import ConfigModule from './config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      database: 'postgres',
      username: 'postgres',
      password: 'postgres',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
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
