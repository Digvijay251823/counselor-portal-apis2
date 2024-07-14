import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CounseleeSadhanaService } from './counselee-sadhana.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SadhanaForm } from 'src/Entities/SadhanaForm.entity';
import { CreateSadhanaFormDto } from 'src/Entities/DTOS/sadhana.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { Role } from 'src/Entities/DTOS/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/Entities/DTOS/Roles.dto';

@ApiTags('counselee-sadhana')
@Controller('counselee-sadhana')
export class CounseleeSadhanaController {
  constructor(private readonly SadhanaFormService: CounseleeSadhanaService) {}

  @ApiOperation({ summary: 'Get all sadhana forms' })
  @ApiResponse({
    status: 201,
    type: [CreateSadhanaFormDto],
  })
  @Get('/')
  async findAll(): Promise<
    { Success: boolean; content: SadhanaForm[] } | Error
  > {
    return this.SadhanaFormService.findAll();
  }

  @ApiOperation({ summary: 'Get sadhana form by ID' })
  @ApiParam({ name: 'id', description: 'Sadhana form ID' })
  @ApiResponse({
    status: 201,
    type: CreateSadhanaFormDto,
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ Success: boolean; content: SadhanaForm } | Error> {
    return this.SadhanaFormService.findOne(id);
  }

  @ApiOperation({ summary: 'Create Sadhana Entry' })
  @ApiBody({ type: CreateSadhanaFormDto })
  @Post('/register')
  @ApiResponseMessage('successfully registered sadhana')
  async create(
    @Body() createSadhanaFormDto: CreateSadhanaFormDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    return this.SadhanaFormService.create(createSadhanaFormDto);
  }

  @ApiOperation({ summary: 'Get All Sadhana Entries Based on counselor id' })
  @Get('/counselor/:counselorid')
  async findByCounselor(@Param('id') id: string) {
    return this.SadhanaFormService.findByCounselor(id);
  }

  @Roles(Role.Counselor, Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'delete previous sadhana form' })
  @ApiResponseMessage('successfully deleted sadhana')
  async remove(@Param('id') id: string) {
    return this.SadhanaFormService.remove(id);
  }
}
