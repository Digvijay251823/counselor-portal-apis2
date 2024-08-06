import { Test, TestingModule } from '@nestjs/testing';
import { PlanningrelocateService } from './planningrelocate.service';

describe('PlanningrelocateService', () => {
  let service: PlanningrelocateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningrelocateService],
    }).compile();

    service = module.get<PlanningrelocateService>(PlanningrelocateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
