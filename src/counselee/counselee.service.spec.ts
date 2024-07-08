import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeService } from './counselee.service';

describe('CounseleeService', () => {
  let service: CounseleeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounseleeService],
    }).compile();

    service = module.get<CounseleeService>(CounseleeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
