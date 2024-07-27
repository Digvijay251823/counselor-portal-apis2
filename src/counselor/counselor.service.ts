import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Counselee } from 'src/Entities/Counselee.entity';
import { Counselor } from 'src/Entities/Counselor.entity';
import { CounselorUpdateDto } from 'src/Entities/DTOS/counselor.dto';
import { CounseleeFilter } from 'src/Entities/DTOS/Filters/counselee.dto';
import { CounselorFilter } from 'src/Entities/DTOS/Filters/counselor.dto';
import { PageableDto } from 'src/Entities/DTOS/pageable.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CounselorService {
  constructor(
    @InjectRepository(Counselor)
    private readonly CounselorRepository: Repository<Counselor>,
    @InjectRepository(Counselee)
    private readonly CounseleeRepository: Repository<Counselee>,
  ) {}
  async getCounselor(pageable: PageableDto, counselorFilter: CounselorFilter) {
    try {
      const query = this.CounselorRepository.createQueryBuilder(
        'counselor',
      ).leftJoinAndSelect('counselor.spouce', 'spouce');
      if (counselorFilter.firstName) {
        query.andWhere('counselor.firstName ILIKE :firstName', {
          firstName: `%${counselorFilter.firstName}%`,
        });
      }
      if (counselorFilter.lastName) {
        query.andWhere('counselor.lastName ILIKE :lastName', {
          lastName: `%${counselorFilter.lastName}%`,
        });
      }
      if (counselorFilter.initiatedName) {
        query.andWhere('counselor.initiatedName ILIKE :initiatedName', {
          initiatedName: `%${counselorFilter.initiatedName}%`,
        });
      }
      if (counselorFilter.phoneNumber) {
        query.andWhere('counselor.phoneNumber ILIKE :phoneNumber', {
          phoneNumber: `%${counselorFilter.phoneNumber}%`,
        });
      }
      if (counselorFilter.gender) {
        query.andWhere('counselor.gender ILIKE :gender', {
          gender: counselorFilter.gender,
        });
      }
      if (counselorFilter.maritalStatus) {
        query.andWhere('counselor.maritalStatus ILIKE :maritalStatus', {
          maritalStatus: `%${counselorFilter.maritalStatus}%`,
        });
      }
      let page = pageable.page || 1;
      if (page < 1) {
        page = 1;
      }

      const limit = pageable.size ? pageable.size : 10;
      const skip = (pageable?.page > 0 ? Number(pageable.page) - 1 : 0) * limit;
      query.skip(skip).take(limit);
      const [counselor, total] = await query.getManyAndCount();
      const totalPages = Math.ceil(total / limit);
      return {
        Success: true,
        content: counselor,
        total,
        currentPage: pageable.page,
        size: pageable.size,
        elements: counselor.length,
        totalPages,
        skiped: skip,
      };
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

  async getCounseleesByCounselor(
    id: string,
    pageable: PageableDto,
    counseleeFilter: CounseleeFilter,
  ) {
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
      const query = this.CounseleeRepository.createQueryBuilder('counselee')
        .leftJoinAndSelect('counselee.spouce', 'spouce')
        .where('counselee.currentCounselor = :id', { id });

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
      if (counseleeFilter.gender) {
        query.andWhere('counselee.gender = :gender', {
          gender: counseleeFilter.gender,
        });
      }
      if (counseleeFilter.maritalStatus) {
        query.andWhere('counselee.maritalStatus = :maritalStatus', {
          maritalStatus: counseleeFilter.maritalStatus,
        });
      }
      let page = pageable.page ? pageable.page : 0;
      const limit = pageable.size || 10;
      const skip = page === 0 ? 0 : page * limit;

      query.skip(skip).take(limit);

      const [counseleesList, total] = await query.getManyAndCount();
      const totalPages = Math.ceil(total / limit);
      return {
        Success: true,
        content: counseleesList,
        total,
        currentPage: pageable.page,
        size: pageable.size,
        elements: counseleesList.length,
        totalPages,
        skiped: skip,
      };
    } catch (error) {
      throw error;
    }
  }
  async getCounseleeByCounselorDropDown(id: string) {
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
          where: { currentCounselor: { id: counselor.id } },
          select: [
            'firstName',
            'lastName',
            'initiatedName',
            'id',
            'email',
            'phoneNumber',
          ],
        });

      return {
        Success: true,
        content: counseleesList,
        elements: counseleesList.length,
        currentCounselor: {
          initiatedName: counselor.initiatedName,
          firstName: counselor.firstName,
          lastName: counselor.firstName,
        },
        total,
      };
    } catch (error) {
      throw error;
    }
  }
}
