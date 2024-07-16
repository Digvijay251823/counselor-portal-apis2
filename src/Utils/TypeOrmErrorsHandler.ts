import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database query failed';

    // Check for specific error codes
    if ('code' in exception) {
      switch (exception.code) {
        case '23505': // Unique violation
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry';
          break;
        case '23503': // Foreign key violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key violation';
          break;
        case '23502': // Not null violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Missing required field';
          break;
        // Add more cases as needed
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      detail: exception.message,
    });
  }
}
