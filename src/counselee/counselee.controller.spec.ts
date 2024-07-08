import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeController } from './counselee.controller';

describe('CounseleeController', () => {
  let controller: CounseleeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounseleeController],
    }).compile();

    controller = module.get<CounseleeController>(CounseleeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
