import { ApiProperty } from '@nestjs/swagger';

export class CreateSadhanaFormDto {
  @ApiProperty()
  counselorId: string;

  @ApiProperty()
  counseleeId: string;

  @ApiProperty()
  numberOfRounds?: string;

  @ApiProperty()
  first8RoundsCompletedTime?: string;

  @ApiProperty()
  next8RoundsCompletedTime?: string;

  @ApiProperty()
  wakeUpTime?: string;

  @ApiProperty()
  sleepTime?: string;

  @ApiProperty()
  prabhupadaBookReading?: number;

  @ApiProperty()
  nonPrabhupadaBookReading?: number;

  @ApiProperty()
  prabhupadaClassHearing?: number;

  @ApiProperty()
  guruClassHearing?: number;

  @ApiProperty()
  otherClassHearing?: number;

  @ApiProperty()
  speaker?: string;

  @ApiProperty()
  attendedArti?: boolean;

  @ApiProperty()
  mobileInternetUsage?: number;
  @ApiProperty()
  topic?: string;
  @ApiProperty()
  visibleSadhana?: string;

  @ApiProperty()
  sadhanaDate: Date;
}
