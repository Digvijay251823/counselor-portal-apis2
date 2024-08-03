import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class CounseleeAttendanceFilter extends CounseleeFilter {
  @ApiPropertyOptional()
  sessionName: string;
  @ApiPropertyOptional()
  startTime: string;
  @ApiPropertyOptional()
  lastName: string;
  @ApiPropertyOptional()
  type: 'Attendance' | 'RSVP';
  @ApiPropertyOptional()
  approvedstate: 'approved' | 'pending';
}
