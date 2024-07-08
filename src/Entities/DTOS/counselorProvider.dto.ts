import { ApiProperty } from '@nestjs/swagger';

export class CounselorProviderSchema {
  @ApiProperty()
  id: string;

  @ApiProperty()
  counselee: string;
  @ApiProperty()
  preferedCounselor1: string;
  @ApiProperty()
  preferedCounselor2: string;
  @ApiProperty()
  preferedCounselor3: string;
  @ApiProperty()
  reasonForCounselorChange: string;
  @ApiProperty()
  alreadySpokenToExistingCounselor: boolean;
  @ApiProperty()
  alreadySpokenToNewCounselor: boolean;
  @ApiProperty({ default: 'PENDING' })
  statusOfChange: 'APPROVED' | 'PENDING';
}
