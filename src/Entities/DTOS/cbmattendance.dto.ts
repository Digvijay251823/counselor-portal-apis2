import { ApiProperty } from '@nestjs/swagger';

export class CreateCBMAttendanceDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  cbmmeetingId: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  counselorId: string;

  @ApiProperty({ enum: ['Attendance', 'RSVP'] })
  type: 'Attendance' | 'RSVP';

  @ApiProperty({ type: 'boolean', required: false })
  isRSVP?: boolean;

  @ApiProperty()
  modeOfAttendance: string;
}
