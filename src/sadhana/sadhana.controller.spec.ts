import { Test, TestingModule } from '@nestjs/testing';
import { SadhanaController } from './sadhana.controller';

describe('SadhanaController', () => {
  let controller: SadhanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SadhanaController],
    }).compile();

    controller = module.get<SadhanaController>(SadhanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
