import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCBMAttendanceDto } from 'src/Entities/DTOS/cbmattendance.dto';
import { CbmattendanceService } from './cbmattendance.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';

@ApiTags('cbmattendance')
@Controller('cbmattendance')
export class CbmattendanceController {
  constructor(private cbmAttendanceService: CbmattendanceService) {}

  @ApiBody({ type: CreateCBMAttendanceDto })
  @ApiResponseMessage('SuccessFully Marked Attendance')
  @Post('/mark')
  async create(@Body() createCBMAttendanceDto: CreateCBMAttendanceDto) {
    return this.cbmAttendanceService.create(createCBMAttendanceDto);
  }

  @ApiResponse({ type: [CreateCBMAttendanceDto], status: 200 })
  @Get('/')
  async findAll() {
    return this.cbmAttendanceService.findAll();
  }

  @ApiResponseMessage('deleted successfully')
  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.cbmAttendanceService.remove(id);
  }
}
