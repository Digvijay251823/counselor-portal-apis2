import { Test, TestingModule } from '@nestjs/testing';
import { CbmMeetingsController } from './cbm-meetings.controller';

describe('CbmMeetingsController', () => {
  let controller: CbmMeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CbmMeetingsController],
    }).compile();

    controller = module.get<CbmMeetingsController>(CbmMeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
