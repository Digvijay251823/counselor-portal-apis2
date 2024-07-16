import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class CounseleeSadhanaFilter extends CounseleeFilter {
  @ApiPropertyOptional()
  sadhanaDate: string;
}
