import { ApiPropertyOptional } from '@nestjs/swagger';

export class CounselorFilter {
  @ApiPropertyOptional()
  firstName: string;
  @ApiPropertyOptional()
  lastName: string;
  @ApiPropertyOptional()
  phoneNumber: string;
  @ApiPropertyOptional()
  initiatedName: string;
  @ApiPropertyOptional()
  gender: string;
  @ApiPropertyOptional()
  maritalStatus: string;
}
