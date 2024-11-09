import { Test, TestingModule } from '@nestjs/testing';
import { ChangeHistoryController } from './change-history.controller';
import { ChangeHistoryService } from './change-history.service';

describe('ChangeHistoryController', () => {
  let controller: ChangeHistoryController;
  let service: ChangeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeHistoryController],
      providers: [
        {
          provide: ChangeHistoryService,
          useValue: {
            // Mock the methods you need for your tests
            getChangeHistoryForEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChangeHistoryController>(ChangeHistoryController);
    service = module.get<ChangeHistoryService>(ChangeHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
