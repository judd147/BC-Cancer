import { Test, TestingModule } from '@nestjs/testing';
import { ChangeHistoryService } from './change-history.service';
import { Repository } from 'typeorm';
import { EventChangeHistory } from './event-change-history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ChangeHistoryService', () => {
  let service: ChangeHistoryService;
  let repository: Repository<EventChangeHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeHistoryService,
        {
          provide: getRepositoryToken(EventChangeHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ChangeHistoryService>(ChangeHistoryService);
    repository = module.get<Repository<EventChangeHistory>>(getRepositoryToken(EventChangeHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
