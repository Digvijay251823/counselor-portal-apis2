import { ApiProperty } from '@nestjs/swagger';

export class CourseSchema {
  @ApiProperty()
  id: string;
  @ApiProperty({ example: 'DYS' })
  code: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
