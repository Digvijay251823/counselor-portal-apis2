import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

// Decorator for custom API response messages
export const ApiResponseMessage = (message: string) =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description: message,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
        },
      },
    }),
  );
