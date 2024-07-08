import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { Activities } from 'src/Entities/Activities.entity';
import { ActivitySchema } from 'src/Entities/DTOS/activity.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/Entities/DTOS/role.enum';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
@ApiTags('activity')
@Controller('activity')
@ApiBearerAuth('JWT-auth')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiResponse({ type: [ActivitySchema] })
  @Get('/')
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }

  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('created new activity')
  @ApiBody({ type: ActivitySchema })
  @Post('/create')
  async createActivities(@Body() activitySchema: Partial<Activities>) {
    return this.activityService.create(activitySchema);
  }
  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('deleted activity successfully')
  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.activityService.delete(id);
  }
}
