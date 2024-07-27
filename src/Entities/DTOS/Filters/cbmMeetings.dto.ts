import { ApiPropertyOptional } from '@nestjs/swagger';

export class CbmMeetingFilter {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional()
  startTime: string;
  @ApiPropertyOptional()
  expired: 'YES' | 'NO';
  @ApiPropertyOptional()
  modeOfAttendance: 'OFFLINE' | 'ONLINE' | 'HYBRID';
}
