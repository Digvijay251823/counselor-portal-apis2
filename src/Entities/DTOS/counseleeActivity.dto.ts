import { ApiProperty } from '@nestjs/swagger';

export class CreateCounseleeActivityDto {
  @ApiProperty()
  counseleeId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  counselorId: string;
  @ApiProperty()
  activityId: string;
  @ApiProperty()
  activityDate: Date;
}

export class UpdateCounseleeActivityDto {
  @ApiProperty()
  counseleeId?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  counselorId?: string;

  @ApiProperty()
  activityId?: string;
}
