import { Test, TestingModule } from '@nestjs/testing';
import { CbmSevaController } from './cbm-seva.controller';

describe('CbmSevaController', () => {
  let controller: CbmSevaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CbmSevaController],
    }).compile();

    controller = module.get<CbmSevaController>(CbmSevaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
