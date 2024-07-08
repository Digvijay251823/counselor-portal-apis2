import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/Entities/DTOS/role.enum';
import * as jwt from 'jsonwebtoken';
interface JwtPayload {
  email: string;
  id: string;
  role: Role;
}

const JWT_SECRET = '5f8f12c9-dcbf-4e88-b58b-8d706f3a4e31';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) {
      return true; // If no roles are specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
    try {
      const user = jwt.verify(token, JWT_SECRET) as JwtPayload;

      request.user = user; // Set user information in the request object
      if (!roles.includes(user.role)) {
        throw new HttpException(
          'You do not have access to this resource',
          HttpStatus.FORBIDDEN,
        );
      }
      return true;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
