import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/Entities/Attendance.entity';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateAttendanceDto } from 'src/Entities/DTOS/counseleeAttendance.dto';
import { CounseleeAttendanceFilter } from 'src/Entities/DTOS/Filters/counselee-attendance.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { ScheduledSession } from 'src/Entities/ScheduledSession.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CounseleeAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(ScheduledSession)
    private readonly scheduledSessionRepository: Repository<ScheduledSession>,
    @InjectRepository(Counselee)
    private readonly counseleeRepository: Repository<Counselee>,
    @InjectRepository(Counselor)
    private readonly counselorRepository: Repository<Counselor>,
  ) {}

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const { scheduledSessionId, counseleeId, counselorId, modeOfAttendance } =
        createAttendanceDto;
      const scheduledSession = await this.scheduledSessionRepository.findOne({
        where: { id: scheduledSessionId },
      });
      if (!scheduledSession)
        throw new HttpException(
          `ScheduledSession with id ${scheduledSessionId} not found`,
          404,
        );

      const counselee = await this.counseleeRepository.findOne({
        where: { id: counseleeId },
      });
      if (!counselee)
        throw new HttpException(
          `Counselee with id ${counseleeId} not found`,
          404,
        );

      const counselor = await this.counselorRepository.findOne({
        where: { id: counselorId },
      });
      if (!counselor)
        throw new HttpException(
          `Counselor with id ${counselorId} not found`,
          404,
        );

      const existingAttendance = await this.attendanceRepository.findOne({
        where: {
          scheduledSession: { id: scheduledSessionId },
          counselee: { id: counseleeId },
          counselor: { id: counselorId },
          modeOfAttendance,
        },
      });

      if (existingAttendance) {
        throw new HttpException(
          'Attendance has already been marked for this session, counselee, and counselor combination',
          409,
        );
      }
      const attendance = this.attendanceRepository.create({
        ...createAttendanceDto,
        scheduledSession,
        modeOfAttendance,
        counselee,
        counselor,
        approved: counselor.autoApprove,
      });
      await this.attendanceRepository.save(attendance);
      return { Success: true, message: 'Successfully marked attendance' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<
    { Success: boolean; content: Attendance[] } | Error
  > {
    try {
      const response = await this.attendanceRepository.find({
        relations: ['scheduledSession', 'counselee', 'counselor'],
      });
      if (response.length === 0) {
        throw new HttpException('no attedance to show', 404);
      }
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async findAllByCounselor(
    id: string,
    pageable: PageableDto,
    attendanceFilter: CounseleeAttendanceFilter,
  ) {
    try {
      const query = this.attendanceRepository
        .createQueryBuilder('counselee-attendance')
        .leftJoinAndSelect('counselee-attendance.counselee', 'counselee')
        .leftJoinAndSelect('counselee-attendance.counselor', 'counselor')
        .leftJoinAndSelect(
          'counselee-attendance.scheduledSession',
          'scheduledSession',
        )
        .where('counselor.id=:id', { id })
        .select([
          'counselee-attendance',
          'scheduledSession',
          'counselee.id',
          'counselee.firstName',
          'counselee.lastName',
          'counselee.initiatedName',
          'counselee.phoneNumber',
        ]);
      if (attendanceFilter.approvedstate) {
        query.where('counselee-attendance.approved  =:approved', {
          approved:
            attendanceFilter.approvedstate === 'approved' ? true : false,
        });
      }
      if (attendanceFilter.startTime) {
        query.andWhere('counselee-attendance.startTime = startTime', {
          startTime: `%${attendanceFilter.startTime}%`,
        });
      }
      if (attendanceFilter.firstName) {
        query.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${attendanceFilter.firstName}%`,
        });
      }
      if (attendanceFilter.lastName) {
        query.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${attendanceFilter.lastName}%`,
        });
      }
      if (attendanceFilter.phoneNumber) {
        query.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${attendanceFilter.phoneNumber}%`,
        });
      }
      if (attendanceFilter.initiatedName) {
        query.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${attendanceFilter.initiatedName}%`,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      query.skip(skip).take(limit);

      const [response, total] = await query.getManyAndCount();
      const approveFilter = await this.attendanceRepository.find({
        where: { counselor: { id } },
        select: ['approved'],
      });
      const totalPages = Math.ceil(Number(total) / limit);
      const approvedTrueCount = approveFilter.filter(
        (record) => record.approved === true,
      ).length;

      const approvedFalseCount = approveFilter.filter(
        (record) => record.approved === false,
      ).length;

      return {
        Success: true,
        content: response,
        approvedRecordsCount: approvedTrueCount,
        pendingRecordsCount: approvedFalseCount,
        total,
        limit,
        skip,
        page,
        elements: response.length,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async approveAttendance(id: string) {
    try {
      const response = await this.attendanceRepository.findOne({
        where: { id: id },
      });
      response.approved = true;
      await this.attendanceRepository.save(response);
      return { Success: true, message: 'successfully approved attendance' };
    } catch (error) {
      throw error;
    }
  }

  async autoApproveByCounselorId(id: string) {
    await this.attendanceRepository.update(
      { counselor: { id: id } },
      { approved: true },
    );
  }

  async remove(id: string): Promise<{ Success: boolean; message: string }> {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });
      if (!attendance) {
        throw new HttpException('attendance not found', 404);
      }
      await this.attendanceRepository.remove(attendance);
      return { Success: true, message: 'deleted Attendance SuccessFully' };
    } catch (error) {
      throw error;
    }
  }

  async AutoApproveOnOFF(counselorid: string) {
    try {
      const counselor = await this.counselorRepository.findOne({
        where: { id: counselorid },
      });
      if (!counselor) {
        throw new HttpException(
          'counselor does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      if (counselor.autoApprove === true) {
        counselor.autoApprove = false;
        await this.counselorRepository.save(counselor);
        return { Success: true, message: 'autoapprove turned off', counselor };
      } else {
        counselor.autoApprove = true;
        await this.counselorRepository.save(counselor);
        return { Success: true, message: 'autoapprove turned on', counselor };
      }
    } catch (error) {
      throw error;
    }
  }
}
