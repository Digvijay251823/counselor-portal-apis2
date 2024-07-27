import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CounselorproviderService } from './counselorprovider.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CounselorProviderSchema } from 'src/Entities/DTOS/counselorProvider.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { CounselorProviderEntity } from 'src/Entities/CounselorProvider.entity';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/Entities/DTOS/role.enum';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { counselorProviderFilter } from 'src/Entities/DTOS/Filters/counselorProvider.dto';

@ApiTags('counselor-provider')
@Controller('counselorprovider')
export class CounselorproviderController {
  constructor(
    private readonly counselorProviderService: CounselorproviderService,
  ) {}
  @ApiOperation({ summary: 'get the ilst of all submissions' })
  @ApiResponse({
    status: 201,
    description: 'List of all Submissions',
    type: CounselorProviderSchema,
  })
  @Get('/')
  async getAll(
    @Query() pageable: PageableDto,
    @Query() counselorProviderFilter: counselorProviderFilter,
  ) {
    return await this.counselorProviderService.getAll(
      pageable,
      counselorProviderFilter,
    );
  }

  @ApiOperation({ summary: 'submit the form for change counselor' })
  @ApiResponseMessage('Submitted the form to change counselor')
  @ApiBody({
    type: CounselorProviderSchema,
  })
  @Post('/create')
  async create(
    @Body() CounselorProviderSchema: Partial<CounselorProviderEntity>,
  ) {
    return this.counselorProviderService.create(CounselorProviderSchema);
  }

  @ApiOperation({ summary: 'submit the form for change counselor' })
  @ApiResponseMessage('Submitted the form to change counselor')
  @Get('approve/:id')
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Roles(Role.CCT, Role.Counselor)
  async approve(@Param('id') id: string) {
    return this.counselorProviderService.approve(id);
  }
}
