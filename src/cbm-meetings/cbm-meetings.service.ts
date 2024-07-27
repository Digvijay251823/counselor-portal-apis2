import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCBMMeeting } from 'src/Entities/DTOS/cbmmeeting.dto';
import { CbmMeetingFilter } from 'src/Entities/DTOS/Filters/cbmMeetings.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CbmMeetingsService {
  constructor(
    @InjectRepository(Counselor)
    private counselorRepository: Repository<Counselor>,
    @InjectRepository(CBMMeeting)
    private CBMMeetingRepository: Repository<CBMMeeting>,
  ) {}

  async create(createCBMMeetingDto: CreateCBMMeeting) {
    try {
      const counselor = await this.counselorRepository.findOne({
        where: { id: createCBMMeetingDto.counselorId },
      });
      if (!counselor) {
        throw new HttpException('counselor not found', HttpStatus.NOT_FOUND);
      }
      const cbmMeeting = this.CBMMeetingRepository.create(createCBMMeetingDto);
      await this.CBMMeetingRepository.save(cbmMeeting);
      return { Success: true, message: 'Scheduled Meeting SuccessFully' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(pageable: PageableDto, cbmMeetingFilter: CbmMeetingFilter) {
    try {
      const queryBuilder =
        this.CBMMeetingRepository.createQueryBuilder('cbm-meeting');

      if (cbmMeetingFilter.name) {
        queryBuilder.andWhere('cbm-meeting.name ILIKE :name', {
          name: `%${cbmMeetingFilter.name}%`,
        });
      }

      if (cbmMeetingFilter.startTime) {
        queryBuilder.andWhere('cbm-meeting.startTime = :startTime', {
          startTime: `%${cbmMeetingFilter.startTime}%`,
        });
      }
      if (cbmMeetingFilter.modeOfAttendance) {
        queryBuilder.andWhere(
          'cbm-meeting.modeOfAttendance =:modeOfAttendance',
          {
            modeOfAttendance: `${cbmMeetingFilter.modeOfAttendance}`,
          },
        );
      }
      if (cbmMeetingFilter.expired) {
        queryBuilder.where('cbm-meeting.expired  =:expired', {
          expired: cbmMeetingFilter.expired === 'YES' ? true : false,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      queryBuilder.skip(skip).take(limit);

      const [meetings, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);
      return {
        Success: true,
        content: meetings,
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

  async findOne(id: string) {
    try {
      const meeting = await this.CBMMeetingRepository.findOne({
        where: { id },
      });

      if (!meeting) {
        throw new HttpException('meeting not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, content: meeting };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCBMMeetingDto: CreateCBMMeeting) {
    try {
      const meeting = await this.CBMMeetingRepository.findOne({
        where: { id },
      });
      if (!meeting) {
        throw new HttpException(
          'meeting does not exists',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.CBMMeetingRepository.update(id, updateCBMMeetingDto);
      return { Success: true, message: 'updated meeting details' };
    } catch (error) {
      throw new error();
    }
  }

  async remove(id: string) {
    try {
      const meeting = await this.CBMMeetingRepository.findOne({
        where: { id },
      });
      if (!meeting) {
        throw new HttpException(
          'meeting does not exists',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.CBMMeetingRepository.delete(id);
      return { Success: true, message: 'meeting deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getUnExpiredSessions() {
    try {
      const unexpired = await this.CBMMeetingRepository.find({
        where: { expired: false },
      });
      return { Success: true, content: unexpired };
    } catch (error) {
      throw error;
    }
  }

  async getSessionsByCounselorId(counselorId: string) {
    return this.CBMMeetingRepository.find({
      where: { counselor: { id: counselorId } },
    });
  }
}
