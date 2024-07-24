import { Delete, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from 'src/Entities/Activities.entity';
import { ApiResponseMessage } from 'src/Entities/DTOS/Success.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activities)
    private readonly activitiesModel: Repository<Activities>,
  ) {}
  async getAllActivities() {
    try {
      const [response, total] = await this.activitiesModel.findAndCount();
      return { Success: true, content: response, total };
    } catch (error) {
      throw error;
    }
  }

  async create(activitySchema: Partial<Activities>) {
    try {
      const activity = await this.activitiesModel.findOne({
        where: { name: activitySchema.name },
      });
      if (activity) {
        throw new HttpException('activity already exists', 409);
      }
      const response = this.activitiesModel.create(activitySchema);
      await this.activitiesModel.save(response);
      return { Success: true, content: { message: 'created new activity' } };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponseMessage('deleted Activity successfully')
  @Delete('/delete/:id')
  async delete(id: string) {
    try {
      const response = await this.activitiesModel.findOne({
        where: { id: id },
      });
      if (!response) {
        throw new HttpException('activity does not exist', 404);
      }
      await this.activitiesModel.delete(id);
      return { Success: true, content: { message: 'deleted Successfully' } };
    } catch (error) {
      throw error;
    }
  }
}
