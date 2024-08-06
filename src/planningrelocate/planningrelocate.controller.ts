import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlanningRelocateDto } from 'src/Entities/DTOS/PlanningRelocate.dto';
import { PlanningrelocateService } from './planningrelocate.service';

@Controller('planningrelocate')
@ApiTags('planningrelocate')
export class PlanningrelocateController {
  constructor(
    private readonly PlanningRelocateService: PlanningrelocateService,
  ) {}

  @Post('/create')
  async Create(@Body() PlanningRelocate: CreatePlanningRelocateDto) {
    return this.PlanningRelocateService.create(PlanningRelocate);
  }

  @Get('/')
  @ApiResponse({ type: CreatePlanningRelocateDto, status: 201 })
  async getEntries() {
    return this.PlanningRelocateService.getEntries();
  }
}
