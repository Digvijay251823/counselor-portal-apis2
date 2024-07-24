import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class CounseleeSadhanaFilter extends CounseleeFilter {
  @ApiPropertyOptional()
  sadhanaDate: string;
  @ApiPropertyOptional()
  startDate: Date;
  @ApiPropertyOptional()
  endDate: Date;
}
