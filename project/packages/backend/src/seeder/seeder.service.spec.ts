import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederService } from './seeder.service';
import { Donor } from '../donors/donor.entity';

describe('SeederService', () => {
  let service: SeederService;
  let repository: Repository<Donor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Donor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    repository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
