import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CbmSevaService } from './cbm-seva.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCBMSevaDto } from 'src/Entities/DTOS/cbmseva.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';

@ApiTags('cbm-seva')
@Controller('cbm-seva')
export class CbmSevaController {
  constructor(private readonly cbmSevaService: CbmSevaService) {}

  @ApiResponseMessage('successfully marked seva')
  @Post('/create')
  async create(@Body() createMeetingDto: CreateCBMSevaDto) {
    return await this.cbmSevaService.create(createMeetingDto);
  }

  @ApiResponse({ type: [CreateCBMSevaDto], status: 200 })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'counselorContactNumber', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('/')
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('counselorContactNumber') counselorContactNumber?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      startDate,
      endDate,
      counselorContactNumber,
      page,
      limit,
      sortField,
      sortOrder,
    };
    return await this.cbmSevaService.findAll(filters);
  }

  @ApiResponse({ type: CreateCBMSevaDto, status: 200 })
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    return await this.cbmSevaService.findOne(id);
  }

  @ApiResponseMessage('deleted cbm entry')
  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.cbmSevaService.remove(id);
  }
}
