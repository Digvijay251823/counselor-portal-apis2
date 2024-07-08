// create-sadhana-form.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSadhanaConfigurationDto {
  @ApiPropertyOptional({ description: 'Number of rounds', type: Boolean })
  numberOfRounds?: boolean;

  @ApiPropertyOptional({
    description: 'First 8 rounds completed time',
    type: Boolean,
  })
  first8RoundsCompletedTime?: boolean;

  @ApiPropertyOptional({
    description: 'Next 8 rounds completed time',
    type: Boolean,
  })
  next8RoundsCompletedTime?: boolean;

  @ApiPropertyOptional({ description: 'Wake up time', type: Boolean })
  wakeUpTime?: boolean;

  @ApiPropertyOptional({ description: 'Sleep time', type: Boolean })
  sleepTime?: boolean;

  @ApiPropertyOptional({
    description: 'Prabhupada book reading',
    type: Boolean,
  })
  prabhupadaBookReading?: boolean;

  @ApiPropertyOptional({
    description: 'Non-Prabhupada book reading',
    type: Boolean,
  })
  nonPrabhupadaBookReading?: boolean;

  @ApiPropertyOptional({
    description: 'Prabhupada class hearing',
    type: Boolean,
  })
  prabhupadaClassHearing?: boolean;

  @ApiPropertyOptional({ description: 'Guru class hearing', type: Boolean })
  guruClassHearing?: boolean;

  @ApiPropertyOptional({ description: 'Other class hearing', type: Boolean })
  otherClassHearing?: boolean;

  @ApiPropertyOptional({ description: 'Speaker', type: Boolean })
  speaker?: boolean;

  @ApiPropertyOptional({ description: 'Attended Arti', type: Boolean })
  attendedArti?: boolean;

  @ApiPropertyOptional({ description: 'Mobile internet usage', type: Boolean })
  mobileInternetUsage?: boolean;
  @ApiPropertyOptional({ description: 'topic', type: Boolean })
  topic?: boolean;
  @ApiPropertyOptional({ description: 'visibleSadhana', type: Boolean })
  visibleSadhana?: boolean;
}
