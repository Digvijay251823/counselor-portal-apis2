import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from 'src/Entities/Activities.entity';
import { Counselee } from 'src/Entities/Counselee.entity';
import { counseleeActivity } from 'src/Entities/CounseleeActivity.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCounseleeActivityDto } from 'src/Entities/DTOS/counseleeActivity.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CounseleeActivityService {
  constructor(
    @InjectRepository(counseleeActivity)
    private readonly counseleeActivityRepository: Repository<counseleeActivity>,
    @InjectRepository(Counselee)
    private readonly counseleeRepository: Repository<Counselee>,
    @InjectRepository(Counselor)
    private readonly counselorRepository: Repository<Counselor>,
    @InjectRepository(Activities)
    private readonly activitiesRepository: Repository<Activities>,
  ) {}

  async create(
    createCounseleeActivityDto: CreateCounseleeActivityDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const {
        counseleeId,
        counselorId,
        activityId,
        description,
        activityDate,
      } = createCounseleeActivityDto;

      const counselee = await this.counseleeRepository.findOneOrFail({
        where: { id: counseleeId },
      });
      if (!counselee) {
        throw new HttpException('Counselee Not Found', HttpStatus.NOT_FOUND);
      }
      const counselor = await this.counselorRepository.findOneOrFail({
        where: { id: counselorId },
      });
      if (!counselor) {
        throw new HttpException('Counselor Not Found', HttpStatus.NOT_FOUND);
      }
      const activity = await this.activitiesRepository.findOneOrFail({
        where: { id: activityId },
      });

      const counseleeActivity = this.counseleeActivityRepository.create({
        counselee,
        description,
        counselor,
        activity,
        activityDate,
      });
      await this.counseleeActivityRepository.save(counseleeActivity);
      return { Success: true, message: 'submitted activity successfully' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<
    { Success: true; content: counseleeActivity[] } | Error
  > {
    try {
      const response = await this.counseleeActivityRepository.find({
        relations: ['counselee', 'counselor', 'activity'],
      });
      if (response.length === 0) {
        throw new HttpException('no entries in counselee Activities', 404);
      }
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async getByCounselorId(id: string) {
    try {
      const response = await this.counselorRepository.findOne({
        where: { id },
      });
      if (!response) {
        throw new HttpException('Counselor not found', 404);
      }
      const counseleeActivity = await this.counseleeActivityRepository.find({
        where: { counselor: { id } },
        relations: ['counselee', 'counselor', 'activity'],
      });
      return { Success: true, content: counseleeActivity };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const response = await this.counseleeActivityRepository.findOne({
        where: { id },
      });
      if (!response) {
        throw new HttpException('activity not found', 404);
      }
      await this.counseleeActivityRepository.delete(id);
      return { Success: true, message: 'deleted activity entry successfully' };
    } catch (error) {
      throw error;
    }
  }
}
