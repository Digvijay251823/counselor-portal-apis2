import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeAttendanceController } from './counselee-attendance.controller';

describe('CounseleeAttendanceController', () => {
  let controller: CounseleeAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounseleeAttendanceController],
    }).compile();

    controller = module.get<CounseleeAttendanceController>(CounseleeAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
