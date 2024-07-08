import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { CBMSeva } from 'src/Entities/CBMSeva.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import {
  CreateCBMSevaDto,
  UpdateCBMSevaDto,
} from 'src/Entities/DTOS/cbmseva.dto';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CbmSevaService {
  constructor(
    @InjectRepository(CBMSeva) private CBMSeva: Repository<CBMSeva>,
    @InjectRepository(Counselor)
    private counselorRepository: Repository<Counselor>,
  ) {}

  async create(createMeetingDto: CreateCBMSevaDto) {
    try {
      const counselorRepository = await this.counselorRepository.findOne({
        where: { id: createMeetingDto.counselorId },
      });
      if (!counselorRepository) {
        throw new HttpException('Counselor not found', HttpStatus.NOT_FOUND);
      }
      const meeting = this.CBMSeva.create({
        ...createMeetingDto,
        counselor: counselorRepository,
      });

      await this.CBMSeva.save(meeting);
      return { Success: true, message: 'Successfully Marked Seva' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(filters: {
    startDate?: string;
    endDate?: string;
    counselorContactNumber?: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    try {
      const {
        startDate,
        endDate,
        counselorContactNumber,
        page = 1,
        limit = 10,
        sortField = 'startTime',
        sortOrder = 'ASC',
      } = filters;

      const where = {};
      if (startDate && endDate) {
        where['startTime'] = Between(new Date(startDate), new Date(endDate));
      }
      if (counselorContactNumber) {
        where['counselor'] = { contactNumber: counselorContactNumber };
      }

      const [result, total] = await this.CBMSeva.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: { [sortField]: sortOrder },
        relations: ['counselor'],
      });
      return { Success: true, content: result, total, page, limit };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const counselor = await this.CBMSeva.findOne({ where: { id } });
      if (!counselor) {
        throw new HttpException('Counselor not found', HttpStatus.NOT_FOUND);
      }
      return { Success: true, content: counselor };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const counselor = await this.counselorRepository.findOne({
        where: { id },
      });
      if (!counselor) {
        throw new HttpException('Counselor Not Found', HttpStatus.NOT_FOUND);
      }
      await this.CBMSeva.delete(id);
      return { Success: true, message: 'counselor seva deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
