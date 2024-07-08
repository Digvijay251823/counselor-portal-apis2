import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SadhanaService } from './sadhana.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSadhanaConfigurationDto } from 'src/Entities/DTOS/SadhanaConfiguration.dto';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';

@ApiTags('sadhana')
@Controller('sadhana')
export class SadhanaController {
  constructor(private readonly sadhanaConfigureService: SadhanaService) {}

  @ApiResponse({
    status: 200,
    description: 'gets the form configuration related to the given counselor',
    type: CreateSadhanaConfigurationDto,
  })
  @Get('/counselor/:id')
  async getSadhanaConfigurationBasedOnCounselor(@Param('id') id: string) {
    return await this.sadhanaConfigureService.getSadhanConfigurationByCounselor(
      id,
    );
  }

  @ApiResponseMessage('configured sadhana successfully')
  @Post('/configure/:counselorId')
  async changeOrCreateSadhanaConfiguration(
    @Param('counselorId') counselorId: string,
    @Body() CreateSadhanaConfigurationDto: CreateSadhanaConfigurationDto,
  ) {
    return await this.sadhanaConfigureService.changeOrCreateSadhanaConfiguration(
      counselorId,
      CreateSadhanaConfigurationDto,
    );
  }

  @ApiResponseMessage('deleted sadhana successfully')
  @Delete('/remove/:id')
  async removeSadhanaConfiguration(@Param('id') id: string) {
    return this.sadhanaConfigureService.removeSadhanaConfiguration(id);
  }
}
