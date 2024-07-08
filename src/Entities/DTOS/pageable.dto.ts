import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageableDto {
  @ApiPropertyOptional({ default: 0, description: 'Page number (0-based)' })
  pageNumber: number = 0;

  @ApiPropertyOptional({ default: 10, description: 'Page size' })
  pageSize: number = 10;

  @ApiPropertyOptional({
    description:
      'Sort parameters in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.',
  })
  sort?: string[];
}
