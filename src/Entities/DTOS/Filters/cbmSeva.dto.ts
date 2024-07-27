import { ApiPropertyOptional } from '@nestjs/swagger';
import { CounselorFilter } from './counselor.dto';

export class CBMSevaFilter extends CounselorFilter {
  @ApiPropertyOptional()
  seva:
    | 'deityWorshipSeva'
    | 'guruPuja'
    | 'location'
    | 'mangalAarti'
    | 'morningJapa'
    | 'otherSeva'
    | 'sbClass';
  @ApiPropertyOptional({ example: new Date() })
  created: string;
}
