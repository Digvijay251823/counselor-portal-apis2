import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
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
      const sadhanaEntryExist = await this.SadhanaForm.findOne({
        where: { counselee: { id: createSadhanaFormDto.counseleeId } },
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
      });
      await this.SadhanaForm.save(sadhanaForm);
      return { Success: true, message: 'successfully submitted form ' };
    } catch (error) {
      throw error;
    }
  }

  async findByCounselor(id: string) {
    try {
      const Counselor = await this.Counselor.findOne({
        where: { id: id },
      });
      if (!Counselor) {
        throw new HttpException('Counselor Not Found', 409);
      }
      const SadhanaEntries = await this.SadhanaForm.find({
        where: { counselor: { id } },
      });

      return { Success: true, content: SadhanaEntries };
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
      return;
    } catch (error) {
      throw error;
    }
  }
}
