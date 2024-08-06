import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Counselee } from 'src/Entities/Counselee.entity';
import { CounselorProviderEntity } from 'src/Entities/CounselorProvider.entity';
import { counselorProviderFilter } from 'src/Entities/DTOS/Filters/counselorProvider.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';

import { Repository } from 'typeorm';

@Injectable()
export class CounselorproviderService {
  constructor(
    @InjectRepository(CounselorProviderEntity)
    private readonly counselorProvider: Repository<CounselorProviderEntity>,
    @InjectRepository(Counselee)
    private readonly counseleeService: Repository<Counselee>,
  ) {}

  async getAll(
    pageable: PageableDto,
    counselorProviderFilter: counselorProviderFilter,
  ) {
    try {
      const queryBuilder = this.counselorProvider
        .createQueryBuilder('counselorProvider')
        .leftJoinAndSelect('counselorProvider.counselee', 'counselee')
        .leftJoinAndSelect('counselee.currentCounselor', 'counselor')
        .leftJoinAndSelect(
          'counselorProvider.preferedCounselor1',
          'preferedCounselor1',
        )
        .leftJoinAndSelect(
          'counselorProvider.preferedCounselor2',
          'preferedCounselor2',
        )
        .leftJoinAndSelect(
          'counselorProvider.preferedCounselor3',
          'preferedCounselor3',
        )
        .select([
          'counselorProvider',
          'counselee.firstName',
          'counselee.lastName',
          'counselee.phoneNumber',
          'counselee.initiatedName',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.phoneNumber',
          'counselor.initiatedName',
          'preferedCounselor1.initiatedName',
          'preferedCounselor1.firstName',
          'preferedCounselor1.lastName',
          'preferedCounselor2.initiatedName',
          'preferedCounselor2.firstName',
          'preferedCounselor2.lastName',
          'preferedCounselor3.initiatedName',
          'preferedCounselor3.firstName',
          'preferedCounselor3.lastName',
        ]);
      if (counselorProviderFilter.firstName) {
        queryBuilder.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${counselorProviderFilter.firstName}%`,
        });
      }
      if (counselorProviderFilter.lastName) {
        queryBuilder.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${counselorProviderFilter.lastName}%`,
        });
      }
      if (counselorProviderFilter.phoneNumber) {
        queryBuilder.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${counselorProviderFilter.phoneNumber}%`,
        });
      }
      if (counselorProviderFilter.initiatedName) {
        queryBuilder.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${counselorProviderFilter.initiatedName}%`,
        });
      }
      if (counselorProviderFilter.statusOfChange) {
        queryBuilder.andWhere(
          'counselorProvider.statusOfChange =:statusOfChange',
          {
            statusOfChange: counselorProviderFilter.statusOfChange,
          },
        );
      }
      if (counselorProviderFilter.alreadySpokenToExistingCounselor) {
        queryBuilder.andWhere(
          'counselorProvider.alreadySpokenToExistingCounselor =:alreadySpokenToExistingCounselor',
          {
            alreadySpokenToExistingCounselor:
              counselorProviderFilter.alreadySpokenToExistingCounselor === 'YES'
                ? true
                : false,
          },
        );
      }
      if (counselorProviderFilter.alreadySpokenToNewCounselor) {
        queryBuilder.andWhere(
          'counselorProvider.alreadySpokenToNewCounselor =:alreadySpokenToNewCounselor',
          {
            alreadySpokenToNewCounselor:
              counselorProviderFilter.alreadySpokenToNewCounselor === 'YES'
                ? true
                : false,
          },
        );
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      queryBuilder.skip(skip).take(limit);
      const [Submissions, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);
      return {
        Success: true,
        content: Submissions,
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
  async create(CounselorProviderSchema: Partial<CounselorProviderEntity>) {
    try {
      const counselee = await this.counseleeService.findOne({
        where: { id: CounselorProviderSchema.counselee.toString() },
      });
      const existingEntry = await this.counselorProvider.findOne({
        where: { counselee: { id: counselee.id }, statusOfChange: 'PENDING' },
      });
      if (existingEntry) {
        throw new HttpException('already exists', HttpStatus.CONFLICT);
      }
      const newEntry = this.counselorProvider.create({
        ...CounselorProviderSchema,
      });
      await this.counselorProvider.save(newEntry);
      return { Success: true, message: 'Submitted the form' };
    } catch (error) {
      throw error;
    }
  }

  async approve(id: string) {
    try {
      const existingEntry = await this.counselorProvider.findOne({
        where: { id },
      });
      if (!existingEntry) {
        throw new HttpException(`there is not entry related to this id`, 404);
      }
      existingEntry.statusOfChange = 'APPROVED';
      await this.counselorProvider.save(existingEntry);
      return { Success: true, content: { message: 'apporved the request' } };
    } catch (error) {
      throw error;
    }
  }
}
