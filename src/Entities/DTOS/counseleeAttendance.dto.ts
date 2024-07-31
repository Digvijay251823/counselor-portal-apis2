import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty()
  scheduledSessionId: string;

  @ApiProperty()
  counseleeId: string;

  @ApiProperty()
  counselorId: string;

  @ApiProperty()
  modeOfAttendance: string;

  @ApiProperty({ enum: ['Attendance', 'RSVP'], default: 'Attendance' })
  type: 'Attendance' | 'RSVP';

  @ApiProperty()
  membersComming: number;

  @ApiProperty({ required: false })
  isRSVP?: boolean;
}

export class UpdateAttendanceDto {
  @ApiProperty()
  scheduledSessionId: string;

  @ApiProperty()
  counseleeId: string;

  @ApiProperty()
  counselorId: string;

  @ApiProperty({ enum: ['Attendance', 'RSVP'], default: 'Attendance' })
  type: 'Attendance' | 'RSVP';

  @ApiProperty({ required: false })
  isRSVP?: boolean;
}
