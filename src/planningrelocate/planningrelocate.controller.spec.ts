import { Test, TestingModule } from '@nestjs/testing';
import { PlanningrelocateController } from './planningrelocate.controller';

describe('PlanningrelocateController', () => {
  let controller: PlanningrelocateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanningrelocateController],
    }).compile();

    controller = module.get<PlanningrelocateController>(PlanningrelocateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
