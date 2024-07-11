import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
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
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ) {
    const skip = (page - 1) * limit;
    const order = { [sortBy]: sortOrder };
    try {
      const counselee = await this.CounseleeModel.find({
        relations: ['husband', 'currentCounselor'],
        skip,
        take: limit,
        order,
      });
      if (counselee?.length === 0) {
        throw new HttpException('No Counselee to show', HttpStatus.NOT_FOUND);
      }
      return { Success: true, content: counselee };
    } catch (error) {
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
        relations: ['husband', 'currentCounselor'],
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
        relations: ['husband', 'currentCounselor'],
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
        where: { husband: { id: counseleeMale.id } },
      });
      return { Success: true, content: counseleeFemale };
    } catch (error) {
      throw error;
    }
  }
}
