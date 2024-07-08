import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/Entities/Attendance.entity';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateAttendanceDto } from 'src/Entities/DTOS/counseleeAttendance.dto';
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
      const { scheduledSessionId, counseleeId, counselorId } =
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

  async findAllByCounselor(id: string, approved: boolean) {
    try {
      const response = await this.attendanceRepository.find({
        where: { counselor: { id: id }, approved: approved },
        relations: ['counselor', 'counselee', 'scheduledSession'],
      });
      // Count approved true and false
      const approvedTrueCount = response.filter(
        (record) => record.approved === true,
      ).length;
      const approvedFalseCount = response.filter(
        (record) => record.approved === false,
      ).length;
      return {
        Success: true,
        content: response,
        approvedRecordsCount: approvedTrueCount,
        pendingRecordsCount: approvedFalseCount,
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
