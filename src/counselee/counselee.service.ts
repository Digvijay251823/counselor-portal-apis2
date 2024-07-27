import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { cctCounselorFilter } from 'src/Entities/DTOS/Filters/cctCounselor.dto';
import { CounseleeFilter } from 'src/Entities/DTOS/Filters/counselee.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CounseleeService {
  constructor(
    @InjectRepository(Counselee)
    private readonly CounseleeModel: Repository<Counselee>,
    @InjectRepository(Counselor)
    private readonly CounselorModel: Repository<Counselor>,
  ) {}

  async getCounselee(
    pageable: PageableDto,
    filtersCounselee: cctCounselorFilter,
  ) {
    try {
      const queryBuilder = this.CounseleeModel.createQueryBuilder('counselee')
        .leftJoinAndSelect('counselee.spouce', 'spouce')
        .leftJoinAndSelect('counselee.currentCounselor', 'currentCounselor')
        .select([
          'counselee',
          'spouce.firstName',
          'spouce.lastName',
          'spouce.phoneNumber',
          'spouce.initiatedName',
          'currentCounselor.initiatedName',
        ]);

      if (filtersCounselee.gender) {
        queryBuilder.andWhere('counselee.gender = :gender', {
          gender: filtersCounselee.gender,
        });
      }
      if (filtersCounselee.maritalStatus) {
        queryBuilder.andWhere('counselee.maritalStatus = :maritalStatus', {
          maritalStatus: filtersCounselee.maritalStatus,
        });
      }

      if (filtersCounselee.counselorInitiatedName) {
        queryBuilder.andWhere(
          'currentCounselor.initiatedName ILIKE :initiatedName',
          {
            initiatedName: `%${filtersCounselee.counselorInitiatedName}%`,
          },
        );
      }
      if (filtersCounselee.initiatedName) {
        queryBuilder.andWhere('counselee.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${filtersCounselee.initiatedName}%`,
        });
      }
      if (filtersCounselee.firstName) {
        queryBuilder.andWhere('counselee.firstName ILIKE :firstName', {
          firstName: `%${filtersCounselee.firstName}%`,
        });
      }
      if (filtersCounselee.lastName) {
        queryBuilder.andWhere('counselee.lastName ILIKE :lastName', {
          lastName: `%${filtersCounselee.lastName}%`,
        });
      }
      if (filtersCounselee.phoneNumber) {
        queryBuilder.andWhere('counselee.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${filtersCounselee.phoneNumber}%`,
        });
      }

      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;
      queryBuilder.skip(skip).take(limit);
      const [result, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);
      return {
        Success: true,
        content: result,
        total: total,
        page: pageable.page,
        limit: limit,
        element: result.length,
        totalPages,
        skipped: skip,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createCounselee(inputData: Partial<Counselee>) {
    try {
      if (
        !inputData.firstName ||
        !inputData.lastName ||
        !inputData.age ||
        !inputData.gender ||
        !inputData.address
      ) {
        throw new HttpException(
          'please enter all the fields carefully',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Check if a counselee with the same phone number already exists
      const existingCounselee = await this.CounseleeModel.findOne({
        where: { phoneNumber: inputData.phoneNumber },
      });
      if (existingCounselee) {
        throw new HttpException(
          'User already exists, please try another phone number',
          HttpStatus.CONFLICT,
        );
      }

      // Create the new counselee
      const newCounselee = this.CounseleeModel.create(inputData);
      await this.CounseleeModel.save(newCounselee);

      return {
        success: true,
        message: 'Counselee created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCounselee(id: string) {
    try {
      const existingCounselee = await this.CounseleeModel.findOne({
        where: { id },
      });
      if (!existingCounselee) {
        throw new HttpException('Counselee not found.', HttpStatus.NOT_FOUND);
      }

      await this.CounseleeModel.delete(id);
      return { Success: true, message: 'Counselee deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateDetails(id: string, updateCounselee: Partial<Counselee>) {
    try {
      const counselee = await this.CounseleeModel.findOne({ where: { id } });
      if (!counselee) {
        throw new HttpException('counselee not found', 404);
      }
      await this.CounseleeModel.update({ id }, { ...updateCounselee });
      return { Success: true, message: 'updated details successfully' };
    } catch (error) {
      throw error;
    }
  }
  async updateCounselee(counselorid: string, counseleeid: string) {
    try {
      if (!counselorid) {
        throw new HttpException(
          'Not Able To Get Counselor',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!counseleeid) {
        throw new HttpException(
          'Not Able To Get Counselee',
          HttpStatus.NOT_FOUND,
        );
      }
      const counselee = await this.CounseleeModel.findOne({
        where: { id: counseleeid },
      });
      const counselor = await this.CounselorModel.findOne({
        where: { id: counselorid },
      });
      if (!counselee || !counselor) {
        throw new HttpException(
          'counselee does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      counselee.currentCounselor = counselor;
      counselee.connectedToCounselorSince = new Date();
      await this.CounseleeModel.save(counselee);
      return { Success: true, message: 'updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getbyPhone(phoneNumber: string) {
    try {
      const Counselee = await this.CounseleeModel.findOne({
        where: { phoneNumber: phoneNumber },
        relations: ['spouce', 'currentCounselor'],
      });
      if (!Counselee) {
        throw new HttpException('counselee doesnt exist', 404);
      }
      return { Success: true, content: Counselee };
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const counselee = await this.CounseleeModel.findOne({
        where: { id },
        relations: ['spouce', 'currentCounselor'],
      });
      if (!counselee) {
        throw new HttpException('counselee doesnt exist please register', 404);
      }
      return { Success: true, Content: counselee };
    } catch (error) {
      throw error;
    }
  }

  async getSpouceDetails(phonenumber: string) {
    try {
      const counseleeMale = await this.CounseleeModel.findOne({
        where: { phoneNumber: phonenumber },
      });
      if (!counseleeMale) {
        throw new HttpException('counselee doesnt exist', 404);
      }

      if (counseleeMale.maritalStatus === 'UNMARRIED') {
        return { Success: true, content: null };
      }
      if (counseleeMale.gender !== 'MALE') {
        return { Success: true, content: null };
      }

      const counseleeFemale = await this.CounseleeModel.findOne({
        where: { spouce: { id: counseleeMale.id } },
      });
      return { Success: true, content: counseleeFemale };
    } catch (error) {
      throw error;
    }
  }
}
