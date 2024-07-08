import { Body, Controller, Param, Post, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
class forgetPasswordSchema {
  @ApiProperty()
  email: string;
  @ApiProperty()
  url: string;
}

import {
  AuthCredentialsDto,
  AuthCredentialsRegisterDto,
  changePasswordDto,
} from 'src/Entities/DTOS/Auth.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponseMessage('successFully signed in')
  // @ApiBody({ type: AuthCredentialsDto })
  @Post('/authenticate/:phoneNumber')
  async authenticate(
    // @Body('email') email: string,
    // @Body('password') password: string,
    @Param('phoneNumber') phoneNumber: string,
  ) {
    return await this.authService.authenticate(phoneNumber);
  }
  @ApiResponseMessage('successFully registered')
  @ApiBody({ type: AuthCredentialsRegisterDto })
  @Post('/registeration')
  async registeration(
    @Body('phoneNumber') phoneNumber: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.registeration(phoneNumber, email, password);
  }
  @ApiResponseMessage('successFully registered')
  @ApiBody({
    type: forgetPasswordSchema,
  })
  @Post('/forgetpassword')
  async forgetPassword(@Body('email') email: string, @Body('url') url: string) {
    return this.authService.forgetPassword(email, url);
  }

  @ApiResponseMessage('successFully registered')
  @Put('/reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Query('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @ApiResponseMessage('successFully registered')
  @ApiBody({ type: changePasswordDto })
  @Put('/changepassword')
  async changePassword(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('password') password: string,
  ) {
    return await this.authService.changePassword(email, oldPassword, password);
  }
}
