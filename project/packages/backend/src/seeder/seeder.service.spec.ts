import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorSeederService } from './donor-seeder.service';
import { Donor } from '../donors/donor.entity';

describe('SeederService', () => {
  let service: DonorSeederService;
  let repository: Repository<Donor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonorSeederService,
        {
          provide: getRepositoryToken(Donor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DonorSeederService>(DonorSeederService);
    repository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
