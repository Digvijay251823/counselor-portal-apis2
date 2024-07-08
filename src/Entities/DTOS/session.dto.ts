import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduledSessionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  modeOfAttendance: string;

  @ApiProperty()
  courseId: string; // Assuming this is the ID of the Course entity

  @ApiProperty()
  counselorId: string; // Assuming this is the ID of the Counselor entity
}

export class UpdateScheduledSessionDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  startTime?: Date;

  @ApiProperty()
  modeOfAttendance?: string;

  @ApiProperty()
  courseId?: string;

  @ApiProperty()
  counselorId?: string;
}
