import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CreateSadhanaConfigurationDto } from 'src/Entities/DTOS/SadhanaConfiguration.dto';
import { SadhanaConfigure } from 'src/Entities/SadhanaConfigure.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SadhanaService {
  constructor(
    @InjectRepository(Counselor)
    private readonly counselorRepository: Repository<Counselor>,
    @InjectRepository(SadhanaConfigure)
    private readonly sadhanaConfiguration: Repository<SadhanaConfigure>,
  ) {}

  async getSadhanConfigurationByCounselor(counselorId: string) {
    try {
      const counselor = await this.counselorRepository.findOne({
        where: { id: counselorId },
      });
      if (!counselor) {
        throw new HttpException('counselor not found', 404);
      }
      const sadhanaConfiguration = await this.sadhanaConfiguration.findOne({
        where: { counselor: { id: counselorId } },
      });
      if (!sadhanaConfiguration) {
        throw new HttpException(
          'no sadhana configuration found please contact to your counselor',
          404,
        );
      }
      return { Success: true, content: sadhanaConfiguration };
    } catch (error) {
      throw error;
    }
  }

  async changeOrCreateSadhanaConfiguration(
    counselorId: string,
    sadhanaConfiguration: CreateSadhanaConfigurationDto,
  ) {
    try {
      const counselor = await this.counselorRepository.findOne({
        where: { id: counselorId },
      });
      if (!counselor) {
        throw new HttpException('counselor not found', 404);
      }
      const sadhanaConfigurationExist = await this.sadhanaConfiguration.findOne(
        { where: { counselor: { id: counselorId } } },
      );
      if (sadhanaConfigurationExist) {
        await this.sadhanaConfiguration.update(
          {
            id: sadhanaConfigurationExist.id,
          },
          { ...sadhanaConfiguration },
        );
        return {
          Success: true,
          message: 'sadhana configuration updated successfully',
        };
      } else {
        const newSadhana = this.sadhanaConfiguration.create({
          ...sadhanaConfiguration,
          counselor: counselor,
        });
        await this.sadhanaConfiguration.save(newSadhana);
        return { Success: true, message: 'sadhana configured successfully' };
      }
    } catch (error) {
      throw error;
    }
  }

  async removeSadhanaConfiguration(id: string) {
    try {
      const sadhanaConfigurationaExists =
        await this.sadhanaConfiguration.findOne({ where: { id } });
      if (!sadhanaConfigurationaExists) {
        throw new HttpException(
          'sadhana configurations does not exist for this id',
          404,
        );
      }
      await this.sadhanaConfiguration.remove(sadhanaConfigurationaExists);
    } catch (error) {
      throw error;
    }
  }
}
