import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { Course } from 'src/Entities/Course.entity';
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
  ): Promise<{ Success: boolean; content: ScheduledSession[] } | Error> {
    try {
      const response = await this.sessionModel.find({
        where: { counselor: { id: id } },
        relations: ['counselor', 'course'],
      });
      if (!response) {
        throw new HttpException('no sessions found', 404);
      }
      return { Success: true, content: response };
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
      const currentTime = new Date();

      const notexpiredSessions = await this.sessionModel
        .createQueryBuilder('session')
        .leftJoinAndSelect('session.course', 'course')
        .leftJoinAndSelect('session.counselor', 'counselor')
        .where('session.startTime > :currentTime', { currentTime })
        .andWhere('counselor.id = :id', { id })
        .getMany();

      return { Success: true, content: notexpiredSessions };
    } catch (error) {
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
