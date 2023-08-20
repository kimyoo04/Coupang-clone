import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // proxy를 통해 들어온 경우, client의 ip 받기
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
