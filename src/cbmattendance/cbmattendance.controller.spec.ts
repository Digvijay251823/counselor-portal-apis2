import { Test, TestingModule } from '@nestjs/testing';
import { CbmattendanceController } from './cbmattendance.controller';

describe('CbmattendanceController', () => {
  let controller: CbmattendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CbmattendanceController],
    }).compile();

    controller = module.get<CbmattendanceController>(CbmattendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
