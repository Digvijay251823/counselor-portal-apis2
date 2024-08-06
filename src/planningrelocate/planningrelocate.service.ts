import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlanningRelocateDto } from 'src/Entities/DTOS/PlanningRelocate.dto';
import { PlanningRelocateEntity } from 'src/Entities/PlanningRelocate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanningrelocateService {
  constructor(
    @InjectRepository(PlanningRelocateEntity)
    private readonly PlanningRelocateEntity: Repository<PlanningRelocateEntity>,
  ) {}

  async create(PlanningRelocate: CreatePlanningRelocateDto) {
    try {
      if (!PlanningRelocate.firstName) {
        throw new HttpException(
          'first name is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!PlanningRelocate.lastName) {
        throw new HttpException(
          'last name is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!PlanningRelocate.phoneNumber) {
        throw new HttpException(
          'phoneNumber is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!PlanningRelocate.gender) {
        throw new HttpException('gender is required', HttpStatus.BAD_REQUEST);
      }
      if (!PlanningRelocate.address) {
        throw new HttpException('address is required', HttpStatus.BAD_REQUEST);
      }
      if (!PlanningRelocate.age) {
        throw new HttpException('age is required', HttpStatus.BAD_REQUEST);
      }
      if (!PlanningRelocate.whenwanttorelocate) {
        throw new HttpException(
          'when do you want to relocate pune',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!PlanningRelocate.whereplannedtolive) {
        throw new HttpException(
          'where are you planning to live in pune',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!PlanningRelocate.expectedsupportfromtemple) {
        throw new HttpException(
          'What support do you need from temple/congregation',
          HttpStatus.BAD_REQUEST,
        );
      }
      const response = await this.PlanningRelocateEntity.findOne({
        where: {
          phoneNumber: PlanningRelocate.phoneNumber.toString(),
        },
      });
      if (response) {
        throw new HttpException(
          'You have already registered',
          HttpStatus.CONFLICT,
        );
      }
      const storingPlanningRelocateEntry =
        this.PlanningRelocateEntity.create(PlanningRelocate);
      await this.PlanningRelocateEntity.save(storingPlanningRelocateEntry);

      return { Success: true, message: 'successfully submitted form' };
    } catch (error) {
      throw error;
    }
  }

  async getEntries() {
    try {
      const planningrelocate = await this.PlanningRelocateEntity.find();
      return { Success: true, content: planningrelocate };
    } catch (error) {
      throw error;
    }
  }
}
