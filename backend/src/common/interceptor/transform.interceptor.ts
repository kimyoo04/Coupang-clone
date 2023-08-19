import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T, R> implements NestInterceptor<T, R> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<R> {
    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();

        if (Array.isArray(data)) {
          return {
            items: data,
            page: Number(req.query.page as string) || 1,
          };
        } else {
          return data;
        }
      }),
    );
  }
}
