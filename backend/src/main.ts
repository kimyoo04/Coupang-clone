import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const port = 8000;
  const app = await NestFactory.create(AppModule, {
    // nestjs logger에 winston 적용
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.STAGE === 'prod' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('Nestjs', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  const configService = app.get(ConfigService);
  const stage = configService.get<string>('STAGE');

  const SWAGGER_ENVS = ['local', 'dev'];
  if (SWAGGER_ENVS.includes(stage)) {
    console.log('swagger enabled');

    // Swagger 인증 설정
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [configService.get<string>('swagger.user')]:
            configService.get<string>('swagger.password'),
        },
      }),
    );

    // Swagger UI 설정
    const config = new DocumentBuilder()
      .setTitle('Coupang-clone API')
      .setDescription('Coupang-clone description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  app.useGlobalFilters(new HttpExceptionFilter());

  // ValidationPipe 전역 적용
  app.useGlobalPipes(
    new ValidationPipe({
      // class-transformer 적용
      transform: true,
    }),
  );

  // interceptor 적용
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
  Logger.log(`listening on port ${port}`);
  Logger.log(`STAGE: ${process.env.STAGE}`);
}
bootstrap();
