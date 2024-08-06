// create-planning-relocate.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreatePlanningRelocateDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  initiatedName?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  age: number;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ default: 'UNMARRIED' })
  maritalStatus?: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  profession?: string;

  @ApiPropertyOptional()
  yourInitiatingSpiritualMaster?: string;

  @ApiPropertyOptional()
  harinamInitiationDate?: string;

  @ApiPropertyOptional()
  legalNameOfSpouce?: string;

  @ApiPropertyOptional()
  harinamInitiationPlace?: string;

  @ApiPropertyOptional()
  chantingRounds?: number;

  @ApiPropertyOptional()
  chantingStartedThisRoundsDate?: Date;

  @ApiPropertyOptional()
  recommendedBy?: string;

  @ApiPropertyOptional()
  comments?: string;

  @ApiProperty()
  whenwanttorelocate: string;

  @ApiProperty()
  whereplannedtolive: string;

  @ApiProperty()
  expectedsupportfromtemple: string;

  @ApiPropertyOptional({ type: 'object' })
  children?: JSON;
}

export class UpdatePlanningRelocateDto extends PartialType(
  CreatePlanningRelocateDto,
) {}
