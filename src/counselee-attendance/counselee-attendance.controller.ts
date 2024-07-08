import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CounseleeAttendanceService } from './counselee-attendance.service';
import { CreateAttendanceDto } from 'src/Entities/DTOS/counseleeAttendance.dto';
import { Attendance } from 'src/Entities/Attendance.entity';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/Entities/DTOS/role.enum';
import { Roles } from 'src/Entities/DTOS/Roles.dto';

@ApiTags('counselee-attendance')
@Controller('counselee-attendance')
export class CounseleeAttendanceController {
  constructor(private readonly attendanceService: CounseleeAttendanceService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create attendance' })
  @ApiResponseMessage('marked attendance successfully')
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return await this.attendanceService.create(createAttendanceDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all attendances' })
  @ApiResponse({
    status: 200,
    description: 'Return all attendances',
    type: [Attendance],
  })
  async findAll(): Promise<
    { Success: boolean; content: Attendance[] } | Error
  > {
    return await this.attendanceService.findAll();
  }

  @Get('counselor/:id')
  @ApiOperation({ summary: 'Get all attendances' })
  @ApiResponse({
    status: 200,
    description: 'Return all attendances',
    type: [Attendance],
  })
  async findAllByCounselor(
    @Query('approved') approved: boolean,
    @Param('id') id: string,
  ): Promise<{ Success: boolean; content: Attendance[] } | Error> {
    return await this.attendanceService.findAllByCounselor(id, approved);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Get('/auto-approve/:counselorid')
  @ApiResponseMessage('Approved all attendance')
  @ApiOperation({ summary: 'Approve all attendance' })
  async autoApproveByCounselorId(@Param('counselorid') counselorid: string) {
    return await this.attendanceService.autoApproveByCounselorId(counselorid);
  }

  @Roles(Role.Counselor)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Get('/approve/:attendanceid')
  @ApiOperation({ summary: 'Approve attendance' })
  async autoApprove(@Param('attendanceid') attendanceid: string) {
    return await this.attendanceService.approveAttendance(attendanceid);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete attendance by id' })
  @ApiResponseMessage('Attendance deleted successfully')
  async remove(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return await this.attendanceService.remove(id);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'auto approve turn on / off' })
  @ApiResponseMessage('Auto Approve turned on / off')
  @Post('/autoapprove/toggle/:counselorid')
  async autoApproveOnOff(@Param('counselorid') counselorid: string) {
    return await this.attendanceService.AutoApproveOnOFF(counselorid);
  }
}
