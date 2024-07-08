import { Test, TestingModule } from '@nestjs/testing';
import { CounselorproviderService } from './counselorprovider.service';

describe('CounselorproviderService', () => {
  let service: CounselorproviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounselorproviderService],
    }).compile();

    service = module.get<CounselorproviderService>(CounselorproviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
