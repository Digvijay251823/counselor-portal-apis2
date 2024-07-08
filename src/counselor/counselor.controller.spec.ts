import { Test, TestingModule } from '@nestjs/testing';
import { CounselorController } from './counselor.controller';

describe('CounselorController', () => {
  let controller: CounselorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounselorController],
    }).compile();

    controller = module.get<CounselorController>(CounselorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
