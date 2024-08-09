import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounselorFilter } from './counselor.dto';

export class CbmAttendanceFilter extends CounselorFilter {
  @ApiPropertyOptional()
  sessionName: string;
  @ApiPropertyOptional()
  startTime: Date;
  @ApiPropertyOptional()
  modeOfAttendance: 'OFFLINE' | 'ONLINE';
  @ApiPropertyOptional({ default: new Date(Date.now()) })
  startDate: Date;
  @ApiPropertyOptional({ default: new Date(Date.now()) })
  endDate: Date;
  @ApiPropertyOptional()
  isRsvp: 'YES' | 'NO';
}
