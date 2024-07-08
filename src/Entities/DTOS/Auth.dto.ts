import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'name@companyname.com' })
  email: string;

  @ApiProperty({ example: '********' })
  password: string;
}

export class AuthCredentialsRegisterDto {
  @ApiProperty({ example: '7229859264' })
  phoneNumber: string;
  @ApiProperty({ example: 'name@companyname.com' })
  email: string;
  @ApiProperty({ example: '********' })
  password: string;
}

export class changePasswordDto {
  @ApiProperty({ example: 'name@companyname.com' })
  email: string;
  @ApiProperty({ example: '********' })
  oldPassword: string;
  @ApiProperty({ example: '********' })
  password: string;
}
