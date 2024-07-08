import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/Entities/Course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getCourses() {
    try {
      const response = await this.courseRepository.find();
      if (response.length === 0) {
        throw new HttpException('no course found to show', 404);
      }
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async create(courseDTO: Partial<Course>) {
    try {
      const course = await this.courseRepository.findOne({
        where: { code: courseDTO.code },
      });
      if (course) {
        throw new HttpException(
          'course already exists try different name',
          409,
        );
      }
      const response = this.courseRepository.create(courseDTO);
      await this.courseRepository.save(response);
      return {
        Success: true,
        content: { message: 'Created Course Successfully' },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(id: string) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      if (!course) {
        throw new HttpException('course not found', 404);
      }
      await this.courseRepository.delete(id);
      return {
        Success: true,
        content: { message: 'course deleted successfully' },
      };
    } catch (error) {
      throw error;
    }
  }

  async findByCode(code: string) {
    try {
      const course = await this.courseRepository.findOne({ where: { code } });
      return { Success: true, content: { course } };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      return { Success: true, content: course };
    } catch (error) {
      throw error;
    }
  }
}
