import { ApiProperty } from '@nestjs/swagger';

export class CounselorSchema {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  initiatedName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  maritalStatus: string;
  // @ApiProperty()
  // husband: string;
  @ApiProperty()
  spouce: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  profession: string;
  @ApiProperty()
  chantingRounds: number;
  @ApiProperty()
  chantingStartedThisRoundsDate: Date;
  @ApiProperty()
  yourInitiatingSpiritualMaster: string;
  @ApiProperty()
  harinamInitiationDate: Date;
  @ApiProperty({ type: () => [childrenSchema] })
  children: childrenSchema[];
}

export class childrenSchema {
  @ApiProperty()
  name: string;
  @ApiProperty()
  age: number;
}

export class CounselorUpdateDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  initiatedName?: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  gender?: string;
  @ApiProperty()
  age?: number;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  maritalStatus?: string;

  @ApiProperty()
  husbandId?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  profession?: string;
  @ApiProperty()
  chantingRounds?: number;
  @ApiProperty()
  chantingStartedThisRoundsDate?: Date;

  @ApiProperty()
  yourInitiatingSpiritualMaster?: string;
  @ApiProperty()
  harinamInitiationDate?: Date;
  @ApiProperty()
  role?: 'cct' | 'counselor';
  @ApiProperty()
  harinamInitiationPlace?: string;
  @ApiProperty()
  autoApprove?: boolean;
  @ApiProperty()
  children?: JSON;
}
