import { ApiProperty } from '@nestjs/swagger';

export class CreateCBMMeeting {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  modeOfAttendance: string;

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
  counselorId?: string;
}
