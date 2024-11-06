import { Test, TestingModule } from '@nestjs/testing';
import { ChangeHistoryController } from './change-history.controller';

describe('ChangeHistoryController', () => {
  let controller: ChangeHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeHistoryController],
    }).compile();

    controller = module.get<ChangeHistoryController>(ChangeHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
