import { ApiProperty } from '@nestjs/swagger';

export class CreateSadhanaFormDto {
  @ApiProperty()
  counselorId: string;
  @ApiProperty()
  counseleeId: string;
  @ApiProperty()
  numberOfRounds?: number;
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
  nonPrabhupadaBookReading?: string;
  @ApiProperty({ description: 'in minutes' })
  prabhupadaClassHearing?: number;
  @ApiProperty({ description: 'in minutes' })
  guruClassHearing?: number;
  @ApiProperty({ description: 'in minutes' })
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
