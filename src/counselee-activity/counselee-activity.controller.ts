import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CounseleeActivityService } from './counselee-activity.service';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCounseleeActivityDto } from 'src/Entities/DTOS/counseleeActivity.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
import { Role } from 'src/Entities/DTOS/role.enum';

@ApiTags('counselee-activity')
@Controller('counselee-activity')
export class CounseleeActivityController {
  constructor(
    private readonly counseleeActivityService: CounseleeActivityService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all counselee activities' })
  @ApiResponse({
    status: 200,
    type: [CreateCounseleeActivityDto],
  })
  findAll() {
    return this.counseleeActivityService.findAll();
  }

  @Get('/counselor/:counselorid')
  @ApiOperation({
    summary: 'Get all counselee activities based on counselor id',
  })
  @ApiResponse({
    status: 200,
    type: [CreateCounseleeActivityDto],
  })
  async getByCounselorId(@Param('counselorid') counselorid: string) {
    return this.counseleeActivityService.getByCounselorId(counselorid);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create counselee activity' })
  @ApiResponseMessage('successfully submitted activity')
  create(@Body() createCounseleeActivityDto: CreateCounseleeActivityDto) {
    return this.counseleeActivityService.create(createCounseleeActivityDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a counselee activity' })
  @ApiResponseMessage('The activity has been successfully deleted.')
  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  remove(@Param('id') id: string) {
    return this.counseleeActivityService.remove(id);
  }
}
