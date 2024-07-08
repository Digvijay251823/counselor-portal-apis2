import { Test, TestingModule } from '@nestjs/testing';
import { CounseleeAttendanceService } from './counselee-attendance.service';

describe('CounseleeAttendanceService', () => {
  let service: CounseleeAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounseleeAttendanceService],
    }).compile();

    service = module.get<CounseleeAttendanceService>(
      CounseleeAttendanceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
