import { Test, TestingModule } from '@nestjs/testing';
import { CbmSevaService } from './cbm-seva.service';

describe('CbmSevaService', () => {
  let service: CbmSevaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CbmSevaService],
    }).compile();

    service = module.get<CbmSevaService>(CbmSevaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
