import { Test, TestingModule } from '@nestjs/testing';
import { CounselorService } from './counselor.service';

describe('CounselorService', () => {
  let service: CounselorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounselorService],
    }).compile();

    service = module.get<CounselorService>(CounselorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
