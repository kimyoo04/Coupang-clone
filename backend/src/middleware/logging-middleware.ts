import { Inject, Logger, NestMiddleware, LoggerService } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = req;
    const userAgent = req.get('user-agent') || '';
    // const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      // const elapsedTime = Date.now() - startTime;
      const contentLength = res.get('content-length');

      this.logger.log(
        `[${method}] ${url} ${statusCode} ${contentLength} ${userAgent} - ${ip}`,
      );
    });

    next();
  }
}
