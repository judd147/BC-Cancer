import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { NotFoundException } from '@nestjs/common';
import { Donor } from '../donors/donor.entity';
import { User } from '../users/user.entity';
import { ChangeHistoryService } from '../change-history/change-history.service';
import { EventDonor } from './event-donor.entity';

describe('EventService', () => {
  let service: EventService;
  let eventsRepository: Repository<Event>;
  let donorsRepository: Repository<Donor>;
  let usersRepository: Repository<User>;
  let eventDonorRepository: Repository<EventDonor>;
  let changeHistoryService: ChangeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Donor),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EventDonor),
          useClass: Repository,
        },
        {
          provide: ChangeHistoryService,
          useValue: {
            // Mock the methods you need for your tests
            logChange: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventsRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    donorsRepository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    changeHistoryService =
      module.get<ChangeHistoryService>(ChangeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const events: Event[] = [];
      jest.spyOn(eventsRepository, 'find').mockResolvedValue(events);

      expect(await service.getAllEvents()).toBe(events);
    });
  });

  describe('createEvent', () => {
    it('should create and return a new event', async () => {
      const eventData: CreateEventDto = {
        name: 'Test Event',
        date: new Date().toISOString(),
        addressLine1: '123 Test St',
        city: 'Test City',
        description: 'Test Description',
        donorIds: [1, 2],
        tags: ['breast cancer'],
      };
      const user: User = { id: 1 } as User;
      const donorsList: Donor[] = [];
      const admins: User[] = [];
      const newEvent: DeepPartial<Event> = {
        id: 1,
        ...eventData,
        eventDonors: [],
        admins,
        createdBy: user,
      };
      jest.spyOn(eventsRepository, 'create').mockReturnValue(newEvent as Event);
      jest.spyOn(donorsRepository, 'find').mockResolvedValue(donorsList);
      jest.spyOn(eventsRepository, 'save').mockResolvedValue(newEvent as Event);
      jest.spyOn(usersRepository, 'find').mockResolvedValue([user]);

      expect(await service.createEvent(eventData, user)).toBe(newEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update and return the event', async () => {
      const user: User = { id: 1 } as User;
      const updateData: Partial<UpdateEventDto> = {
        name: 'Updated Event',
      };
      const existingEvent: DeepPartial<Event> = {
        id: 1,
        name: 'Test Event',
        date: new Date(),
        createdBy: user,
      };
      const updatedEvent: DeepPartial<Event> = {
        ...existingEvent,
        ...updateData,
        admins: [],
      };

      jest
        .spyOn(eventsRepository, 'findOne')
        .mockResolvedValue(existingEvent as Event);
      jest.spyOn(donorsRepository, 'find').mockResolvedValue([]);
      jest
        .spyOn(eventsRepository, 'save')
        .mockResolvedValue(updatedEvent as Event);
      jest.spyOn(usersRepository, 'find').mockResolvedValue([user]);
      expect(await service.updateEvent(1, updateData, user)).toBe(updatedEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateEvent(1, {}, { id: 1 } as User),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete and return the event', async () => {
      const existingEvent: DeepPartial<Event> = {
        id: 1,
        name: 'Test Event',
        date: new Date(),
        createdBy: { id: 1 } as User,
      };

      jest
        .spyOn(eventsRepository, 'findOne')
        .mockResolvedValue(existingEvent as Event);
      jest
        .spyOn(eventsRepository, 'remove')
        .mockResolvedValue(existingEvent as Event);
      jest
        .spyOn(eventsRepository, 'softRemove')
        .mockResolvedValue(existingEvent as Event);

      expect(await service.deleteEvent(1, { id: 1 } as User)).toBe(
        existingEvent,
      );
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteEvent(1, { id: 1 } as User)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
