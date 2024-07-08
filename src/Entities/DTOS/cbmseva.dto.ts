import { ApiProperty } from '@nestjs/swagger';

export class CreateCBMSevaDto {
  @ApiProperty({ default: false })
  deityWorshipSeva: boolean;
  @ApiProperty({ default: false })
  guruPuja: boolean;
  @ApiProperty({ default: false })
  mangalAarti: boolean;
  @ApiProperty({ default: false })
  morningJapa: boolean;
  @ApiProperty({ default: false })
  otherSeva: boolean;
  @ApiProperty({ default: false })
  sbClass: boolean;
  @ApiProperty()
  CBMMeetingId: string;
  @ApiProperty()
  counselorId: string;
  @ApiProperty()
  location: string;
}

export class UpdateCBMSevaDto {
  name?: string;
  description?: string;
  startTime?: Date;
  modeOfAttendance?: string;
  expired?: boolean;
}
