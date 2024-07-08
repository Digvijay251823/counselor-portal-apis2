import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CbmMeetingsService } from './cbm-meetings.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCBMMeeting } from 'src/Entities/DTOS/cbmmeeting.dto';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';

@ApiTags('CBM Meetings')
@Controller('cbm-meetings')
export class CbmMeetingsController {
  constructor(private readonly cbmService: CbmMeetingsService) {}

  @ApiBody({ type: CreateCBMMeeting, description: 'schedule meeting' })
  @ApiResponseMessage('scheduled meeting successfully')
  @Post('/create')
  create(@Body() createCBMMeetingDto: CreateCBMMeeting) {
    return this.cbmService.create(createCBMMeetingDto);
  }

  @ApiResponse({
    type: CreateCBMMeeting,
    status: 201,
    description: 'get all scheduled meetings',
  })
  @Get('/')
  async findAll() {
    return this.cbmService.findAll();
  }

  @ApiResponse({
    type: CreateCBMMeeting,
    status: 200,
    description: 'get scheduled session by id',
  })
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    return this.cbmService.findOne(id);
  }

  @ApiResponseMessage('updated details of meeting successfully')
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCBMMeetingDto: CreateCBMMeeting,
  ) {
    return this.cbmService.update(id, updateCBMMeetingDto);
  }
  @ApiResponseMessage('deleted meeting successfully')
  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.cbmService.remove(id);
  }

  @ApiResponse({ type: [CreateCBMMeeting], status: 202 })
  @Get('/unexpired')
  async getUnExpiredSessions() {
    return this.cbmService.getUnExpiredSessions();
  }
  @ApiResponse({ type: [CreateCBMMeeting] })
  @Get('counselor/:counselorId')
  async getSessionsByCounselorId(@Param('counselorId') counselorId: string) {
    return this.cbmService.getSessionsByCounselorId(counselorId);
  }
}
