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
import { CBMSevaFilter } from 'src/Entities/DTOS/Filters/cbmSeva.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';

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
  @Get('/')
  async findAll(
    @Query() cbmSevaFilter: CBMSevaFilter,
    @Query() pageable: PageableDto,
  ) {
    return await this.cbmSevaService.findAll(pageable, cbmSevaFilter);
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
