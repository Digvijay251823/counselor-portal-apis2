import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeSadhanaService } from './counselee-sadhana.service';

describe('CounseleeSadhanaService', () => {
  let service: CounseleeSadhanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounseleeSadhanaService],
    }).compile();

    service = module.get<CounseleeSadhanaService>(CounseleeSadhanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
