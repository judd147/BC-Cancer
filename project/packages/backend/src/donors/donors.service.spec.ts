import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorsService } from './donors.service';
import { Donor } from './donor.entity';
import { SeederService } from '../seeder/seeder.service';

describe('DonorsService', () => {
  let service: DonorsService;
  let repository: Repository<Donor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonorsService,
        {
          provide: getRepositoryToken(Donor),
          useClass: Repository,
        },
        SeederService,
      ],
    }).compile();

    service = module.get<DonorsService>(DonorsService);
    repository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
