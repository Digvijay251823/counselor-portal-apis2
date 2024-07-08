import { Test, TestingModule } from '@nestjs/testing';
import { CbmMeetingsService } from './cbm-meetings.service';

describe('CbmMeetingsService', () => {
  let service: CbmMeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CbmMeetingsService],
    }).compile();

    service = module.get<CbmMeetingsService>(CbmMeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
