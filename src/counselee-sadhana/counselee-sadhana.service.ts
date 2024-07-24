import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CounseleeFilter } from 'src/Entities/DTOS/Filters/counselee.dto';
import { CounseleeSadhanaFilter } from 'src/Entities/DTOS/Filters/sadhana.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { CreateSadhanaFormDto } from 'src/Entities/DTOS/sadhana.dto';
import { SadhanaForm } from 'src/Entities/SadhanaForm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CounseleeSadhanaService {
  constructor(
    @InjectRepository(SadhanaForm)
    private readonly SadhanaForm: Repository<SadhanaForm>,
    @InjectRepository(Counselee)
    private readonly Counselee: Repository<Counselee>,
    @InjectRepository(Counselor)
    private readonly Counselor: Repository<Counselor>,
  ) {}

  async findAll(): Promise<
    { Success: boolean; content: SadhanaForm[] } | Error
  > {
    try {
      const response = await this.SadhanaForm.find({
        relations: ['counselee', 'counselor'],
      });
      if (response.length === 0) {
        throw new HttpException('no sadhana entries to show', 404);
      }

      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: string,
  ): Promise<{ Success: boolean; content: SadhanaForm } | Error> {
    try {
      const response = await this.SadhanaForm.findOne({ where: { id } });
      return { Success: true, content: response };
    } catch (error) {
      throw error;
    }
  }

  async create(
    createSadhanaFormDto: CreateSadhanaFormDto,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const date = new Date(createSadhanaFormDto.sadhanaDate);
      const normalizedSadhanaDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const sadhanaEntryExist = await this.SadhanaForm.findOne({
        where: {
          counselee: { id: createSadhanaFormDto.counseleeId },
          counselor: { id: createSadhanaFormDto.counselorId },
          sadhanaDate: normalizedSadhanaDate,
        },
      });
      if (sadhanaEntryExist) {
        throw new HttpException('sadhana already given', 409);
      }
      const counselee = await this.Counselee.findOne({
        where: { id: createSadhanaFormDto.counseleeId },
      });
      if (!counselee) {
        throw new HttpException('Counselee Not Found', 404);
      }
      const counselor = await this.Counselor.findOne({
        where: { id: createSadhanaFormDto.counselorId },
      });
      if (!counselor) {
        throw new HttpException('Counselor Not Found', 404);
      }
      const sadhanaForm = this.SadhanaForm.create({
        ...createSadhanaFormDto,
        counselee: counselee,
        counselor: counselor,
        sadhanaDate: normalizedSadhanaDate,
      });

      await this.SadhanaForm.save(sadhanaForm);
      return { Success: true, message: 'successfully submitted Sadhana' };
    } catch (error) {
      throw error;
    }
  }

  async findByCounselor(
    id: string,
    pageable: PageableDto,
    counseleeFilter: CounseleeSadhanaFilter,
  ) {
    try {
      const Counselor = await this.Counselor.findOne({
        where: { id: id },
      });
      if (!Counselor) {
        throw new HttpException('Counselor Not Found', 409);
      }

      const query = this.SadhanaForm.createQueryBuilder('sadhana')
        .leftJoinAndSelect('sadhana.counselee', 'counselee')
        .leftJoinAndSelect('sadhana.counselor', 'counselor')
        .where('counselor.id = :id', { id })
        .select([
          'sadhana',
          'counselor.id',
          'counselor.firstName',
          'counselor.lastName',
          'counselor.initiatedName',
          'counselor.phoneNumber',
          'counselee.id',
          'counselee.firstName',
          'counselee.lastName',
          'counselee.initiatedName',
          'counselee.phoneNumber',
        ]);

      if (counseleeFilter.firstName) {
        query.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${counseleeFilter.firstName}%`,
        });
      }
      if (counseleeFilter.lastName) {
        query.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${counseleeFilter.lastName}%`,
        });
      }
      if (counseleeFilter.phoneNumber) {
        query.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${counseleeFilter.phoneNumber}%`,
        });
      }
      if (counseleeFilter.initiatedName) {
        query.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${counseleeFilter.initiatedName}%`,
        });
      }
      if (counseleeFilter.startDate && counseleeFilter.endDate) {
        query.andWhere('sadhana.sadhanaDate BETWEEN :startDate AND :endDate', {
          startDate: `%${counseleeFilter.startDate}%`,
          endDate: `%${counseleeFilter.endDate}%`,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      query.skip(skip).take(limit);
      const [SadhanaEntries, total] = await query.getManyAndCount();
      const totalPages = Math.ceil(Number(total) / limit);
      return {
        Success: true,
        content: SadhanaEntries,
        total,
        limit,
        skip,
        page,
        elements: SadhanaEntries.length,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      const response = await this.SadhanaForm.findOne({ where: { id } });
      if (!response) {
        throw new HttpException('sadhanaEntry doesnt exist', 404);
      }
      await this.SadhanaForm.delete(id);
      return { Success: true, message: 'Deleted Sadhana Successfully' };
    } catch (error) {
      throw error;
    }
  }
}
