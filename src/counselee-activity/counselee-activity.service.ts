import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from 'src/Entities/Activities.entity';
import { Counselee } from 'src/Entities/Counselee.entity';
import { counseleeActivity } from 'src/Entities/CounseleeActivity.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCounseleeActivityDto } from 'src/Entities/DTOS/counseleeActivity.dto';
import { ActivitiesFilters } from 'src/Entities/DTOS/Filters/counselee-activity.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
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

  async findAll(
    activitiesFilter: ActivitiesFilters,
    pageable: PageableDto,
  ): Promise<{ Success: true; content: counseleeActivity[] } | Error | any> {
    try {
      const QueryBuilder = this.counseleeActivityRepository
        .createQueryBuilder('counselee-activity')
        .innerJoinAndSelect('counselee-activity.counselee', 'counselee')
        .innerJoinAndSelect('counselee-activity.activity', 'activity')
        .select([
          'counselee-activity',
          'counselee.id',
          'counselee.firstName',
          'counselee.lastName',
          'counselee.phoneNumber',
          'counselee.initiatedName',
          'activity.name',
        ]);

      if (activitiesFilter.firstName) {
        QueryBuilder.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${activitiesFilter.firstName}%`,
        });
      }
      if (activitiesFilter.lastName) {
        QueryBuilder.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${activitiesFilter.lastName}%`,
        });
      }
      if (activitiesFilter.phoneNumber) {
        QueryBuilder.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${activitiesFilter.phoneNumber}%`,
        });
      }
      if (activitiesFilter.initiatedName) {
        QueryBuilder.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${activitiesFilter.initiatedName}%`,
        });
      }
      if (activitiesFilter.activityName) {
        QueryBuilder.andWhere('activity.name ILIKE :activityName', {
          activityName: `%${activitiesFilter.activityName}%`,
        });
      }
      if (activitiesFilter.activityDate) {
        QueryBuilder.andWhere('activity.activityDate ILIKE :activityDate', {
          activityDate: `%${activitiesFilter.activityDate}%`,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      QueryBuilder.skip(skip).take(limit);

      const [response, total] = await QueryBuilder.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);
      return {
        Success: true,
        content: response,
        total,
        limit,
        skip,
        page,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getByCounselorId(
    id: string,
    activitiesFilter: ActivitiesFilters,
    pageable: PageableDto,
  ) {
    try {
      const response = await this.counselorRepository.findOne({
        where: { id },
      });
      if (!response) {
        throw new HttpException('Counselor not found', 404);
      }
      const QueryBuilder = this.counseleeActivityRepository
        .createQueryBuilder('counselee-activity')
        .innerJoinAndSelect('counselee-activity.counselee', 'counselee')
        .innerJoinAndSelect('counselee-activity.counselor', 'counselor')
        .innerJoinAndSelect('counselee-activity.activity', 'activity')
        .where('counselor.id = :id', { id })
        .select([
          'counselee-activity',
          'counselee.id',
          'counselee.firstName',
          'counselee.lastName',
          'counselee.phoneNumber',
          'counselee.initiatedName',
          'counselor.id',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.phoneNumber',
          'counselor.initiatedName',
          'activity.name',
        ]);

      if (activitiesFilter.firstName) {
        QueryBuilder.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${activitiesFilter.firstName}`,
        });
      }
      if (activitiesFilter.lastName) {
        QueryBuilder.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${activitiesFilter.lastName}`,
        });
      }
      if (activitiesFilter.phoneNumber) {
        QueryBuilder.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${activitiesFilter.phoneNumber}`,
        });
      }
      if (activitiesFilter.initiatedName) {
        QueryBuilder.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${activitiesFilter.initiatedName}`,
        });
      }
      if (activitiesFilter.activityName) {
        QueryBuilder.andWhere('activity.name ILIKE :activityName', {
          activityName: `%${activitiesFilter.activityName}`,
        });
      }
      if (activitiesFilter.activityDate) {
        QueryBuilder.andWhere('activity.activityDate ILIKE :activityDate', {
          activityDate: `%${activitiesFilter.activityDate}`,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      QueryBuilder.skip(skip).take(limit);

      const [result, total] = await QueryBuilder.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);
      return {
        Success: true,
        content: result,
        total,
        limit,
        skip,
        page,
        totalPages,
      };
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
