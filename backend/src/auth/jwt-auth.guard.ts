import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();
    const token = headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode(token);

    // refresh route 외에 refresh Token 으로 요청 시 에러 처리
    if (url !== '/api/auth/refresh' && decoded['tokenType'] === 'refresh') {
      console.error('Access Token is required');
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }
}
