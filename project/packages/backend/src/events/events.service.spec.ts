import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { NotFoundException } from '@nestjs/common';
import { Donor } from '../donors/donor.entity';

describe('EventService', () => {
  let service: EventService;
  let eventsRepository: Repository<Event>;
  let donorsRepository: Repository<Donor>;

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
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventsRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    donorsRepository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
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
      const eventData: CreateEventDto = { name: 'Test Event', date: new Date().toISOString(), addressLine1: '123 Test St', city: 'Test City', description: 'Test Description', donorsList: ['1', '2'] };
      const donorsList: Donor[] = [];
      const newEvent: DeepPartial<Event> = { id: 1, ...eventData, donorsList };
      jest.spyOn(eventsRepository, 'create').mockReturnValue(newEvent as Event);
      jest.spyOn(donorsRepository, 'find').mockResolvedValue(donorsList);
      jest.spyOn(eventsRepository, 'save').mockResolvedValue(newEvent as Event);

      expect(await service.createEvent(eventData)).toBe(newEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update and return the event', async () => {
      const updateData: Partial<UpdateEventDto> = { name: 'Updated Event', donorsList: ['1', '2'] };
      const existingEvent: DeepPartial<Event> = { id: 1, name: 'Test Event', date: new Date() };
      const updatedEvent: DeepPartial<Event> = { ...existingEvent, ...updateData, donorsList: [] };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(existingEvent as Event);
      jest.spyOn(donorsRepository, 'find').mockResolvedValue([]);
      jest.spyOn(eventsRepository, 'save').mockResolvedValue(updatedEvent as Event);

      expect(await service.updateEvent(1, updateData)).toBe(updatedEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateEvent(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete and return the event', async () => {
      const existingEvent: DeepPartial<Event> = { id: 1, name: 'Test Event', date: new Date() };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(existingEvent as Event);
      jest.spyOn(eventsRepository, 'remove').mockResolvedValue(existingEvent as Event);

      expect(await service.deleteEvent(1)).toBe(existingEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteEvent(1)).rejects.toThrow(NotFoundException);
    });
  });
});
