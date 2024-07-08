import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ScheduledSession } from 'src/Entities/ScheduledSession.entity';
import {
  CreateScheduledSessionDto,
  UpdateScheduledSessionDto,
} from 'src/Entities/DTOS/session.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { Role } from 'src/Entities/DTOS/role.enum';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @Get('/')
  @ApiOperation({ summary: 'Get all scheduled sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all scheduled sessions',
    type: [CreateScheduledSessionDto],
  })
  async findAll(): Promise<
    { Success: boolean; content: ScheduledSession[] } | Error
  > {
    return this.sessionService.findAll();
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get a scheduled session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the scheduled session',
    type: CreateScheduledSessionDto,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession } | Error> {
    return this.sessionService.findOne(id);
  }

  @ApiOperation({ summary: 'Get a scheduled session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the scheduled session',
    type: CreateScheduledSessionDto,
  })
  @Get('/counselor/:id')
  async ScheduledSessionCounselor(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession[] } | Error> {
    return this.sessionService.findOneBasedOnCounselor(id);
  }

  @ApiOperation({
    summary: 'Get a scheduled session by ID which are not expired',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the scheduled session which are not expired',
    type: CreateScheduledSessionDto,
  })
  @Get('/counselor/not-expired/:id')
  async ScheduledSessionsNotExpired(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession[] } | Error> {
    return this.sessionService.findOneBasedOnCounselorandExpiration(id);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Post('/create')
  @ApiOperation({ summary: 'Create a new scheduled session' })
  @ApiResponseMessage('The scheduled session has been successfully created')
  async create(
    @Body() createScheduledSessionDto: CreateScheduledSessionDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return this.sessionService.create(createScheduledSessionDto);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Put('/update/:id')
  @ApiOperation({ summary: 'Update an existing scheduled session' })
  @ApiResponseMessage('The scheduled session has been successfully updated')
  async update(
    @Param('id') id: string,
    @Body() updateScheduledSessionDto: UpdateScheduledSessionDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return this.sessionService.update(id, updateScheduledSessionDto);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a scheduled session by ID' })
  @ApiResponseMessage('The scheduled session has been successfully deleted')
  async remove(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return this.sessionService.remove(id);
  }
}
