import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CBMMeeting } from 'src/Entities/CBMMeetings.entity';
import { CBMSeva } from 'src/Entities/CBMSeva.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateCBMSevaDto } from 'src/Entities/DTOS/cbmseva.dto';
import { CBMSevaFilter } from 'src/Entities/DTOS/Filters/cbmSeva.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
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

  async findAll(pageable: PageableDto, cbmSevaFilter: CBMSevaFilter) {
    try {
      const queryBuilder = this.CBMSeva.createQueryBuilder('cbm-seva')
        .leftJoinAndSelect('cbm-seva.counselor', 'counselor')
        .select([
          'cbm-seva',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.initiatedName',
          'counselor.phoneNumber',
          'counselor.maritalStatus',
        ]);

      if (cbmSevaFilter.created) {
        queryBuilder.andWhere('cbm-seva.createdAt =:createdAt', {
          createdAt: cbmSevaFilter.created,
        });
      }
      if (cbmSevaFilter.seva === 'mangalAarti') {
        queryBuilder.andWhere('cbm-seva.mangalAarti =:mangalAarti', {
          mangalAarti: true,
        });
      }
      if (cbmSevaFilter.seva === 'guruPuja') {
        queryBuilder.andWhere('cbm-seva.guruPuja =:guruPuja', {
          guruPuja: true,
        });
      }
      if (cbmSevaFilter.seva === 'deityWorshipSeva') {
        queryBuilder.andWhere('cbm-seva.deityWorshipSeva =:deityWorshipSeva', {
          deityWorshipSeva: true,
        });
      }
      if (cbmSevaFilter.seva === 'morningJapa') {
        queryBuilder.andWhere('cbm-seva.morningJapa =:morningJapa', {
          morningJapa: true,
        });
      }
      if (cbmSevaFilter.seva === 'sbClass') {
        queryBuilder.andWhere('cbm-seva.sbClass =:sbClass', {
          sbClass: true,
        });
      }
      if (cbmSevaFilter.seva === 'otherSeva') {
        queryBuilder.andWhere('cbm-seva.otherSeva =:otherSeva', {
          otherSeva: true,
        });
      }

      if (cbmSevaFilter.firstName) {
        queryBuilder.andWhere('counselor.firstName ILIKE :firstName', {
          firstName: `%${cbmSevaFilter.firstName}%`,
        });
      }
      if (cbmSevaFilter.lastName) {
        queryBuilder.andWhere('counselor.lastName ILIKE :lastName', {
          lastName: `%${cbmSevaFilter.lastName}%`,
        });
      }
      if (cbmSevaFilter.phoneNumber) {
        queryBuilder.andWhere('counselor.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${cbmSevaFilter.phoneNumber}%`,
        });
      }
      if (cbmSevaFilter.initiatedName) {
        queryBuilder.andWhere('counselor.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${cbmSevaFilter.initiatedName}%`,
        });
      }

      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      queryBuilder.skip(skip).take(limit);
      const [result, total] = await queryBuilder.getManyAndCount();
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
