import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeActivityService } from './counselee-activity.service';

describe('CounseleeActivityService', () => {
  let service: CounseleeActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounseleeActivityService],
    }).compile();

    service = module.get<CounseleeActivityService>(CounseleeActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
