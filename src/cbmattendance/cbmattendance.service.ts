import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMAttendance } from 'src/Entities/CBMAttendance.entity';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCBMAttendanceDto } from 'src/Entities/DTOS/cbmattendance.dto';
import { CbmAttendanceFilter } from 'src/Entities/DTOS/Filters/cbmattendance.dto';
import { CbmMeetingFilter } from 'src/Entities/DTOS/Filters/cbmMeetings.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
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

  async findAll(
    pageable: PageableDto,
    cbmAttendanceFilter: CbmAttendanceFilter,
  ) {
    try {
      const queryBuilder = this.cbmAttendanceRepository
        .createQueryBuilder('cbmattendance')
        .leftJoinAndSelect('cbmattendance.cbmMeeting', 'cbmMeeting')
        .leftJoinAndSelect('cbmattendance.counselor', 'counselor')
        .select([
          'cbmattendance',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.initiatedName',
          'counselor.phoneNumber',
          'cbmMeeting',
        ]);

      if (cbmAttendanceFilter.firstName) {
        queryBuilder.andWhere('counselor.firstName ILIKE :firstName', {
          firstName: `%${cbmAttendanceFilter.firstName}%`,
        });
      }
      if (cbmAttendanceFilter.sessionName) {
        queryBuilder.andWhere('cbmMeeting.name ILIKE :sessionName', {
          sessionName: `%${cbmAttendanceFilter.sessionName}%`,
        });
      }
      if (cbmAttendanceFilter.lastName) {
        queryBuilder.andWhere('counselor.lastName ILIKE :lastName', {
          lastName: `%${cbmAttendanceFilter.lastName}%`,
        });
      }
      if (cbmAttendanceFilter.phoneNumber) {
        queryBuilder.andWhere('counselor.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${cbmAttendanceFilter.phoneNumber}%`,
        });
      }
      if (cbmAttendanceFilter.initiatedName) {
        queryBuilder.andWhere('counselor.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${cbmAttendanceFilter.initiatedName}%`,
        });
      }
      if (cbmAttendanceFilter.startTime) {
        queryBuilder.andWhere('cbmMeeting.startTime =:startTime', {
          startTime: `%${cbmAttendanceFilter.startTime}%`,
        });
      }
      if (cbmAttendanceFilter.modeOfAttendance) {
        queryBuilder.andWhere(
          'cbmattendance.modeOfAttendance =:modeOfAttendance',
          {
            modeOfAttendance: cbmAttendanceFilter.modeOfAttendance,
          },
        );
      }
      if (cbmAttendanceFilter.isRsvp) {
        queryBuilder.where('cbmattendance.isRSVP  =:isRsvp', {
          isRsvp: cbmAttendanceFilter.isRsvp === 'YES' ? true : false,
        });
      }
      if (cbmAttendanceFilter.startDate && cbmAttendanceFilter.endDate) {
        queryBuilder.andWhere(
          'cbmattendance.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: `%${cbmAttendanceFilter.startDate}%`,
            endDate: `%${cbmAttendanceFilter.endDate}%`,
          },
        );
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('cbmMeeting.startTime', 'DESC');
      const [attendance, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);

      return {
        Success: true,
        content: attendance,
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
