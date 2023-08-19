import { ROLES_KEY } from '@/common/decorator/role.decorator';
import { Role } from '@/user/enum/user.enum';
import { UserService } from '@/user/user.service';
import {
  Inject,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
  LoggerService,
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
    private userService: UserService,
    @Inject(Logger) private logger: LoggerService,
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
      const error = new UnauthorizedException('Access Token is required');
      this.logger.error(error.message, error.stack); // 에러 스텍 확인
      throw error;
    }

    // Roles 데코레이터가 있는지 확인
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Roles 데코레이터가 있으면 Admin 권한이 있는지 확인
    if (requireRoles) {
      const userId = decoded['sub'];
      return this.userService.checkUserIsAdmin(userId);
    }

    return super.canActivate(context);
  }
}
