import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounseleeFilter } from './counselee.dto';

export class counselorProviderFilter extends CounseleeFilter {
  @ApiPropertyOptional()
  statusOfChange: 'PENDING' | 'APPROVED';
  @ApiPropertyOptional()
  alreadySpokenToExistingCounselor: 'YES' | 'NO';
  @ApiPropertyOptional()
  alreadySpokenToNewCounselor: 'YES' | 'NO';
}
