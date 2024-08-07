import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CounselorService } from './counselor.service';
import {
  CounselorSchema,
  CounselorUpdateDto,
} from 'src/Entities/DTOS/counselor.dto';
import { Counselor } from 'src/Entities/Counselor.entity';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { Role } from 'src/Entities/DTOS/role.enum';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { CounseleeSchema } from 'src/Entities/DTOS/counselee.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { CounselorFilter } from 'src/Entities/DTOS/Filters/counselor.dto';
import { CounseleeFilter } from 'src/Entities/DTOS/Filters/counselee.dto';

@ApiTags('Counselor')
@Controller('Counselor')
export class CounselorController {
  constructor(private readonly counselorService: CounselorService) {}
  @ApiOperation({ summary: 'get the ilst of all counselors' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 201,
    description: 'List of all counselors',
    type: CounselorSchema,
  })
  @Get('/')
  async getCounselor(
    @Query() pageable: PageableDto,
    @Query() counselorFilter: CounselorFilter,
  ) {
    return this.counselorService.getCounselor(pageable, counselorFilter);
  }
  @Get('/assistant-counselor')
  async getAssistantCounselors(
    @Query() pageable: PageableDto,
    @Query() counselorFilter: CounselorFilter,
  ) {
    return this.counselorService.getAssistantCounselor(
      pageable,
      counselorFilter,
    );
  }

  @ApiResponseMessage('Counselor created successfully')
  @ApiBody({ type: CounselorSchema })
  @Post('/create')
  async createCounselor(@Body() CounselorDto: Partial<Counselor>) {
    return this.counselorService.createCounselor(CounselorDto);
  }

  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('counselor deleted successfully')
  @ApiOperation({ summary: 'deleting counselor' })
  @Delete('/delete/:id')
  async deleteCounselor(@Param('id') id: string) {
    return this.counselorService.deleteCounselor(id);
  }

  @Roles(Role.Counselor)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('password updated successfully')
  @ApiOperation({ summary: 'update counselor password' })
  @Put('/updatepassword/:id')
  async updatePassword(
    @Param('id') id: string,
    @Query('password') password: string,
  ) {
    return this.counselorService.updatePassword(id, password);
  }

  @Put('/updatedetails/:id')
  @ApiOperation({ summary: 'Update a counselor' })
  @ApiParam({ name: 'id', description: 'The ID of the counselor' })
  @ApiBody({ type: CounselorUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'The updated counselor',
    type: Counselor,
  })
  async updateCounselor(
    @Param('id') id: string,
    @Body() updateDto: CounselorUpdateDto,
  ) {
    return this.counselorService.updateCounselor(id, updateDto);
  }

  @ApiOperation({ summary: 'getCounselor by phone' })
  @ApiResponse({ type: CounselorSchema })
  @Get('/phonenumber/:phonenumber')
  async getCounselorByPhone(@Param('phonenumber') phone: string) {
    return this.counselorService.getCounselorByPhone(phone);
  }

  @ApiOperation({ summary: 'getCounselor by email' })
  @ApiResponse({ type: CounselorSchema })
  @Get('/email/:email')
  async getCounselorByEmail(@Param('email') email: string) {
    return this.counselorService.getCounselorByEmail(email);
  }

  @ApiOperation({ summary: 'getCounselor by id' })
  @ApiResponse({ type: CounselorSchema })
  @Get('/id/:id')
  async getCounselorById(@Param('id') id: string) {
    return this.counselorService.getCounselorById(id);
  }

  @ApiResponse({ type: [CounseleeSchema] })
  @Get('/counselees/:id')
  @ApiOperation({ summary: 'get counselees by counselor id' })
  async getCounseleesByCounselor(
    @Param('id') id: string,
    @Query() pageable: PageableDto,
    @Query() counseleeFilter: CounseleeFilter,
  ) {
    return this.counselorService.getCounseleesByCounselor(
      id,
      pageable,
      counseleeFilter,
    );
  }
  @ApiResponse({ type: [CounseleeSchema] })
  @Get('/dropdown/counselees/:id')
  @ApiOperation({ summary: 'get counselees by counselor id' })
  async getCounseleeByCounselorDropDown(@Param('id') id: string) {
    return this.counselorService.getCounseleeByCounselorDropDown(id);
  }
  @Get('/get/settings/:id')
  @ApiOperation({ summary: 'get counselor settings' })
  async getSettings(@Param('id') id: string) {
    return this.counselorService.getSettings(id);
  }
}
