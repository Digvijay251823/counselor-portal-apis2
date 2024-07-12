import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CounselorUpdateDto } from 'src/Entities/DTOS/counselor.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CounselorService {
  constructor(
    @InjectRepository(Counselor)
    private readonly CounselorRepository: Repository<Counselor>,
    @InjectRepository(Counselee)
    private readonly CounseleeRepository: Repository<Counselee>,
  ) {}
  async getCounselor(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ) {
    try {
      const skip = (page - 1) * limit;
      const order = { [sortBy]: sortOrder };
      const counselor = await this.CounselorRepository.find({
        relations: ['husband'],
        skip,
        take: limit,
        order,
      });

      return { Success: true, content: counselor };
    } catch (error) {
      throw error;
    }
  }

  async createCounselor(counselorDto: Partial<Counselor>) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: {
          phoneNumber: counselorDto.phoneNumber,
        },
      });
      if (counselor) {
        throw new HttpException(
          `counselor already exist with ${counselorDto.phoneNumber}`,
          HttpStatus.CONFLICT,
        );
      }
      const counselornew = this.CounselorRepository.create(counselorDto);
      await this.CounselorRepository.save(counselornew);
      return counselornew;
    } catch (error) {
      throw error;
    }
  }

  async deleteCounselor(id: string) {
    try {
      const existingCounselor = await this.CounselorRepository.findOne({
        where: { id },
      });
      if (!existingCounselor) {
        throw new HttpException('Counselor not found.', HttpStatus.NOT_FOUND);
      }

      await this.CounselorRepository.delete(id);
      return { Success: true, message: 'Counselor deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { id: id },
      });
      if (!counselor) {
        throw new HttpException(
          'counselor does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      counselor.password = password;
      await this.CounselorRepository.save(counselor);
      return { Success: true, content: { message: 'updated successfully' } };
    } catch (error) {
      throw error;
    }
  }

  async getCounselorByPhone(phone: string) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { phoneNumber: phone },
      });
      if (!counselor) {
        throw new HttpException('counselor doesnt exist', 404);
      }
      return { Success: true, content: counselor };
    } catch (error) {
      throw error;
    }
  }

  async getCounselorByEmail(email: string) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { email: email },
      });
      if (!counselor) {
        throw new HttpException('counselor doesnt exist', 404);
      }
      return { Success: true, content: counselor };
    } catch (error) {
      throw error;
    }
  }
  async getCounselorById(id: string) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { id: id },
      });
      if (!counselor) {
        throw new HttpException('counselor doesnt exist', 404);
      }
      return { Success: true, content: counselor };
    } catch (error) {
      throw error;
    }
  }

  async updateCounselor(id: string, updateDto: CounselorUpdateDto) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { id },
        relations: ['husband'],
      });
      if (!counselor) {
        throw new HttpException(
          `Counselor with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      // Update the counselor entity with new values
      for (const [key, value] of Object.entries(updateDto)) {
        if (key === 'password' && value) {
          counselor.password = value;
        } else if (key === 'husbandId') {
          counselor.husband = await this.CounselorRepository.findOne({
            where: { id: value },
          });
        } else {
          counselor[key] = value;
        }
      }
      await this.CounselorRepository.save(counselor);
      return { Success: true, message: 'updated Details successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getCounseleesByCounselor(id: string) {
    try {
      const counselor = await this.CounselorRepository.findOne({
        where: { id },
      });
      if (!counselor) {
        throw new HttpException(
          'No Counselor Exists with this id',
          HttpStatus.NOT_FOUND,
        );
      }
      const [counseleesList, total] =
        await this.CounseleeRepository.findAndCount({
          where: { currentCounselor: { id } },
        });
      if (counseleesList.length === 0) {
        throw new HttpException('no counselee exists', HttpStatus.NOT_FOUND);
      }
      return { Success: true, content: counseleesList, total };
    } catch (error) {
      throw error;
    }
  }
}
