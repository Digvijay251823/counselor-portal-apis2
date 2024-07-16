import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class ScheduledSessionFilter {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional()
  startTime: string;
  @ApiPropertyOptional()
  modeOfAttendance: string;
}
