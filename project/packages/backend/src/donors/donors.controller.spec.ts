import { Test, TestingModule } from '@nestjs/testing';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

describe('DonorsController', () => {
  let controller: DonorsController;
  let service: DonorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorsController],
      providers: [
        {
          provide: DonorsService,
          useValue: {
            // Mock the methods you need for your tests
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DonorsController>(DonorsController);
    service = module.get<DonorsService>(DonorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
