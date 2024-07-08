import { Test, TestingModule } from '@nestjs/testing';
import { CbmattendanceService } from './cbmattendance.service';

describe('CbmattendanceService', () => {
  let service: CbmattendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CbmattendanceService],
    }).compile();

    service = module.get<CbmattendanceService>(CbmattendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
