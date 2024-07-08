import { ApiProperty } from '@nestjs/swagger';
import { childrenSchema } from './counselor.dto';

export class CounseleeSchema {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  initiatedName: string;
  @ApiProperty()
  phoneNumber: number;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  maritalStatus: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  profession: string;
  @ApiProperty()
  yourInitiatingSpiritualMaster: string;
  @ApiProperty()
  harinamInitiationDate: Date;
  @ApiProperty()
  harinamInitiationPlace: string;
  @ApiProperty()
  recommendedBy: string;
  @ApiProperty()
  currentCounselor: string;
  @ApiProperty()
  connectedToCounselorSinceYear: Date;
  @ApiProperty()
  husband: string;
  @ApiProperty({ type: () => [childrenSchema] })
  children: childrenSchema[];
}

export class updateCounselor {
  @ApiProperty()
  counselorid: string;
  @ApiProperty()
  counseleeid: string;
}
