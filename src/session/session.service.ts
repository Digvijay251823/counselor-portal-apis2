import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { Course } from 'src/Entities/Course.entity';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import {
  CreateScheduledSessionDto,
  UpdateScheduledSessionDto,
} from 'src/Entities/DTOS/session.dto';
import { ScheduledSession } from 'src/Entities/ScheduledSession.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(ScheduledSession)
    private readonly sessionModel: Repository<ScheduledSession>,
    @InjectRepository(Counselor)
    private readonly counselorModel: Repository<Counselor>,
    @InjectRepository(Counselee)
    private readonly CounseleeModel: Repository<Counselee>,
    @InjectRepository(Course)
    private readonly courseModel: Repository<Course>,
  ) {}

  async findAll(): Promise<
    { Success: boolean; content: ScheduledSession[] } | Error
  > {
    try {
      const response = await this.sessionModel.find({
        relations: ['counselor', 'course'],
      });
      if (response.length === 0) {
        throw new HttpException('no sessions to show', 404);
      }
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession } | Error> {
    try {
      const response = await this.sessionModel.findOne({ where: { id } });
      if (!response) {
        throw new HttpException('session not found', 404);
      }
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async findOneBasedOnCounselor(
    id: string,
    Pageable: PageableDto,
  ): Promise<
    | {
        Success: boolean;
        content: ScheduledSession[];
        total: number;
        limit: number;
        element: number;
        skiped: number;
      }
    | Error
  > {
    try {
      let page = Pageable.page || 1;
      if (page < 1) {
        page = 1;
      }
      const limit = Pageable.size || 10;
      const skip = (Pageable?.page > 0 ? Number(Pageable.page) - 1 : 0) * limit;

      const [response, total] = await this.sessionModel.findAndCount({
        where: { counselor: { id: id } },
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!response) {
        throw new HttpException('no sessions found', 404);
      }
      return {
        Success: true,
        content: response,
        total,
        limit: limit,
        element: response.length,
        skiped: skip,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneBasedOnCounselorandExpiration(
    id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession[] } | Error> {
    try {
      const currentTime = new Date();
      const fortyEightHoursAgo = new Date(
        currentTime.getTime() - 72 * 60 * 60 * 1000,
      );

      const sessions = await this.sessionModel
        .createQueryBuilder('session')
        .leftJoinAndSelect('session.counselor', 'counselor')
        .where('session.startTime > :fortyEightHoursAgo', {
          fortyEightHoursAgo,
        })
        .andWhere('session.startTime <= :currentTime', { currentTime })
        .andWhere('counselor.id = :id', { id })
        .getMany();
      return { Success: true, content: sessions };
    } catch (error) {
      throw error;
    }
  }

  async findOneBasedOnCounselorForRsvp(
    id: string,
  ): Promise<{ Success: boolean; content: ScheduledSession[] } | Error> {
    try {
      const currentTime = new Date().toISOString();
      const notexpiredSessions = await this.sessionModel
        .createQueryBuilder('session')
        .leftJoinAndSelect('session.course', 'course')
        .leftJoinAndSelect('session.counselor', 'counselor')
        .where('session.startTime > :currentTime', { currentTime })
        .andWhere('counselor.id = :id', { id })
        .orderBy('session.createdAt', 'DESC')
        .select([
          'session.id',
          'session.name',
          'session.startTime',
          'counselor.id',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.initiatedName',
        ])
        .getMany();
      return { Success: true, content: notexpiredSessions };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(
    createScheduledSessionDto: CreateScheduledSessionDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const counselor = await this.counselorModel.findOne({
        where: { id: createScheduledSessionDto.counselorId },
      });
      if (!counselor) {
        throw new HttpException('counselor not found', 404);
      }
      const course = await this.courseModel.findOne({
        where: { id: createScheduledSessionDto.courseId },
      });
      if (!course) {
        throw new HttpException('course not found', 404);
      }
      const scheduledSession = this.sessionModel.create({
        name: createScheduledSessionDto.name,
        description: createScheduledSessionDto.description,
        startTime: createScheduledSessionDto.startTime,
        modeOfAttendance: createScheduledSessionDto.modeOfAttendance,
        course: course,
        counselor: counselor,
      });
      await this.sessionModel.save(scheduledSession);
      return { Success: true, message: 'Successfully added a session' };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateScheduledSessionDto: UpdateScheduledSessionDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const response = await this.sessionModel.findOne({ where: { id } });
      if (!response) {
        throw new HttpException('session not found', 404);
      }
      await this.sessionModel.update(id, updateScheduledSessionDto);
      return { Success: true, message: 'Updated Session successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const response = await this.sessionModel.findOne({ where: { id } });
      if (!response) {
        throw new HttpException('session not found', 404);
      }
      await this.sessionModel.delete(id);
      return { Success: true, message: 'deleted session successfully' };
    } catch (error) {}
  }
}
