import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
}
