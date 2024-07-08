import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeActivityController } from './counselee-activity.controller';

describe('CounseleeActivityController', () => {
  let controller: CounseleeActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounseleeActivityController],
    }).compile();

    controller = module.get<CounseleeActivityController>(
      CounseleeActivityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
