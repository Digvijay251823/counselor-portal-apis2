import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeSadhanaController } from './counselee-sadhana.controller';

describe('CounseleeSadhanaController', () => {
  let controller: CounseleeSadhanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounseleeSadhanaController],
    }).compile();

    controller = module.get<CounseleeSadhanaController>(
      CounseleeSadhanaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
