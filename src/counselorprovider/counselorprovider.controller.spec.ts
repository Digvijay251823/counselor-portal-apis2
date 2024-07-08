import { Test, TestingModule } from '@nestjs/testing';
import { CounselorproviderController } from './counselorprovider.controller';

describe('CounselorproviderController', () => {
  let controller: CounselorproviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounselorproviderController],
    }).compile();

    controller = module.get<CounselorproviderController>(CounselorproviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
