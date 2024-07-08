import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CourseSchema } from 'src/Entities/DTOS/Course.dto';
import { Course } from 'src/Entities/Course.entity';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/Entities/DTOS/Roles.dto';
import { Role } from 'src/Entities/DTOS/role.enum';
@ApiTags('course')
@Controller('course')
@ApiBearerAuth('JWT-auth')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @ApiResponse({ type: CourseSchema })
  @Get('/')
  async getCourses() {
    return await this.courseService.getCourses();
  }

  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('created Course Successfully')
  @ApiBody({ type: CourseSchema })
  @Post('/create')
  async createCourse(@Body() courseDTO: Partial<Course>) {
    return await this.courseService.create(courseDTO);
  }

  @Roles(Role.CCT)
  @UseGuards(RolesGuard)
  @ApiSecurity('JWT-auth')
  @ApiResponseMessage('deleted course successfully')
  @Delete('/delete/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Get('/id/:id')
  @ApiResponse({ type: Course })
  async getById(@Param('id') id: string) {
    return await this.courseService.findById(id);
  }

  @Get('/code/:code')
  @ApiResponse({ type: Course })
  async getByCode(@Param('code') code: string) {
    return await this.courseService.findByCode(code);
  }
}
