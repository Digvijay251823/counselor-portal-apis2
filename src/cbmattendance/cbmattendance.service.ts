import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMAttendance } from 'src/Entities/CBMAttendance.entity';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCBMAttendanceDto } from 'src/Entities/DTOS/cbmattendance.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CbmattendanceService {
  constructor(
    @InjectRepository(CBMAttendance)
    private cbmAttendanceRepository: Repository<CBMAttendance>,
    @InjectRepository(Counselor)
    private CounselorRepository: Repository<Counselor>,
    @InjectRepository(CBMMeeting)
    private CBMMeetingRepository: Repository<CBMMeeting>,
  ) {}
  async create(createCBMAttendanceDto: CreateCBMAttendanceDto) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { id: createCBMAttendanceDto.counselorId },
      });
      if (!counselor) {
        throw new HttpException('counselor not found', HttpStatus.NOT_FOUND);
      }
      const meeting = await this.CBMMeetingRepository.findOne({
        where: { id: createCBMAttendanceDto.cbmmeetingId },
      });
      if (!meeting) {
        throw new HttpException('meeting not found', HttpStatus.NOT_FOUND);
      }
      const existingAttendance = await this.cbmAttendanceRepository.findOne({
        where: {
          counselor: { id: counselor.id },
          cbmMeeting: { id: meeting.id },
        },
      });
      if (existingAttendance) {
        throw new HttpException(
          'already marked attendance ',
          HttpStatus.CONFLICT,
        );
      }
      const cbmAttendance = this.cbmAttendanceRepository.create({
        ...createCBMAttendanceDto,
        counselor: counselor,
        cbmMeeting: meeting,
      });
      await this.cbmAttendanceRepository.save(cbmAttendance);
      return { Success: true, message: 'attendance Marked Successfully' };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const attendance = await this.cbmAttendanceRepository.find({
        relations: ['counselor', 'cbmMeeting'],
      });
      return { Success: true, content: attendance };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.cbmAttendanceRepository.findOne({
        where: { id },
      });
      if (!response) {
        throw new HttpException('Attendance Not Found', HttpStatus.NOT_FOUND);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const attendanceResponse = await this.cbmAttendanceRepository.findOne({
        where: { id },
      });
      if (!attendanceResponse) {
        throw new HttpException('No Attendance Found', HttpStatus.NOT_FOUND);
      }
      await this.cbmAttendanceRepository.delete(id);
      return { Success: true, message: 'Successfully deleted the attendance' };
    } catch (error) {
      throw error;
    }
  }
}
