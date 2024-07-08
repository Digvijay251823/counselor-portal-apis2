import { Test, TestingModule } from '@nestjs/testing';
import { SadhanaService } from './sadhana.service';

describe('SadhanaService', () => {
  let service: SadhanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SadhanaService],
    }).compile();

    service = module.get<SadhanaService>(SadhanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
