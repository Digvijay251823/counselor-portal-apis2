import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class cctCounselorFilter extends CounseleeFilter {
  @ApiPropertyOptional()
  counselorInitiatedName: string;
}
