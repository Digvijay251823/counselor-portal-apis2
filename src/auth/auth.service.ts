import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counselor } from 'src/Entities/Counselor.entity';
import { EmailServiceService } from 'src/email-service/email-service.service';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
const RESET_PASSWORD_SECRET =
  'fa94e3e9b9941e5b89f7689b4f4df7f4d9d4c5b6c8e7d8f6a7e9f6b8d7a9c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Counselor)
    private readonly counselorModel: Repository<Counselor>,
    private emailService: EmailServiceService,
  ) {}

  async authenticate(phoneNumber: string) {
    try {
      const Counselor = await this.counselorModel.findOne({
        where: { phoneNumber },
        select: [
          'id',
          'password',
          'autoApprove',
          'firstName',
          'lastName',
          'initiatedName',
          'phoneNumber',
          'email',
          'role',
        ],
      });
      if (!Counselor) {
        throw new HttpException('counselor with credentials not found', 404);
      }
      // if (!Counselor.password) {
      //   throw new HttpException(
      //     'you dont have a password attached to you account try reseting it',
      //     400,
      //   );
      // }
      // const isMatched = await Counselor.comparePassword(phoneNumber);
      // if (!isMatched) {
      //   throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
      // }
      const token = Counselor.getJWTToken();
      const user = {
        id: Counselor.id,
        initiatedName: Counselor.initiatedName,
        email: Counselor.email,
        phoneNumber: Counselor.phoneNumber,
        role: Counselor.role,
        autoApprove: Counselor.autoApprove,
      };
      return {
        Success: true,
        counselor: user,
        token,
        message: 'authenticated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async signin(email: string, password: string) {
    try {
      const Counselor = await this.counselorModel.findOne({
        where: { email },
        select: [
          'id',
          'password',
          'autoApprove',
          'firstName',
          'lastName',
          'initiatedName',
          'phoneNumber',
          'email',
          'role',
        ],
      });
      if (!Counselor) {
        throw new HttpException(
          'counselor with credentials not found try signup',
          404,
        );
      }
      if (!Counselor.password) {
        throw new HttpException(
          'you dont have a password attached to you account try reseting it',
          400,
        );
      }
      const isMatched = await Counselor.comparePassword(password);
      if (!isMatched) {
        throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
      }
      const token = Counselor.getJWTToken();
      const user = {
        id: Counselor.id,
        initiatedName: Counselor.initiatedName,
        email: Counselor.email,
        phoneNumber: Counselor.phoneNumber,
        role: Counselor.role,
        autoApprove: Counselor.autoApprove,
      };
      return {
        Success: true,
        counselor: user,
        token,
        message: 'authenticated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async registeration(phoneNumber: string, email: string, password: string) {
    try {
      const Counselor = await this.counselorModel.findOne({
        where: { phoneNumber },
      });
      if (!Counselor) {
        throw new HttpException('counselor not found please contact cct', 404);
      }
      if (Counselor.email !== null) {
        throw new HttpException(
          'you already have an account please signin',
          HttpStatus.UNAUTHORIZED,
        );
      }

      Counselor.email = email;
      Counselor.password = password;
      await this.counselorModel.save(Counselor);
      const token = Counselor.getJWTToken();
      return {
        Success: true,
        token,
        message: 'registered successfully please signin',
      };
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(email: string, url: string) {
    try {
      const counselor = await this.counselorModel.findOne({ where: { email } });
      if (!counselor) {
        throw new HttpException(
          'counselor does not exist with this email',
          404,
        );
      }
      const Resettoken = jwt.sign({ email }, RESET_PASSWORD_SECRET, {
        expiresIn: '24h',
      });
      const restlink = `${url}/auth/forgetpassword?resettoken=${Resettoken}`;
      return await this.emailService.sendEmail(
        email,
        'RESET_PASSWORD',
        restlink,
      );
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, password: string) {
    const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
    const counselor = await this.counselorModel.findOne({
      where: { email: decoded['email'] },
    });
    counselor.password = password;
    await this.counselorModel.save(counselor);
    return { Success: true, message: 'Successfully changed your password' };
  }

  async changePassword(email: string, oldPassword: string, password: string) {
    try {
      const Counselor = await this.counselorModel.findOne({ where: { email } });
      if (!Counselor) {
        throw new HttpException('counselor does not exist', 404);
      }
      const isMatched = await Counselor.comparePassword(oldPassword);
      if (!isMatched) {
        throw new HttpException(
          'entered wrong old password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      Counselor.password = password;
      await this.counselorModel.save(Counselor);
      return { Success: true, message: 'updated password successfully' };
    } catch (error) {
      throw error;
    }
  }
}
