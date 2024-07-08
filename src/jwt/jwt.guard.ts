import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_TOKEN;
@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const userId = jwt.verify(token, JWT_SECRET);
      request.user = { userId }; // Optional: Set user information in the request object
      return true;
    } catch (error) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
  }
}
