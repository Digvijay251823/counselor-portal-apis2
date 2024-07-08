import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCBMMeeting } from 'src/Entities/DTOS/cbmmeeting.dto';
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

  async findAll() {
    try {
      const meetings = await this.CBMMeetingRepository.find();
      return { Success: true, content: meetings };
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
