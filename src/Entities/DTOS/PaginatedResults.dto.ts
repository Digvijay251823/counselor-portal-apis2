import { ApiProperty } from '@nestjs/swagger';

class SortDto {
  @ApiProperty()
  sorted: boolean;

  @ApiProperty()
  empty: boolean;

  @ApiProperty()
  unsorted: boolean;
}

class PageableResponseDto {
  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  paged: boolean;

  @ApiProperty()
  unpaged: boolean;

  @ApiProperty({ type: SortDto })
  sort: SortDto;
}

export class PaginatedResultDto<T> {
  @ApiProperty({ isArray: true })
  content: T[];

  @ApiProperty()
  pageable: PageableResponseDto;

  @ApiProperty()
  totalElements: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  last: boolean;

  @ApiProperty()
  size: number;

  @ApiProperty()
  number: number;

  @ApiProperty({ type: SortDto })
  sort: SortDto;

  @ApiProperty()
  numberOfElements: number;

  @ApiProperty()
  first: boolean;

  @ApiProperty()
  empty: boolean;
}
