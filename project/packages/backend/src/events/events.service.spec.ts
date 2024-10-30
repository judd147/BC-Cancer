import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const events: Event[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(events);

      expect(await service.getAllEvents()).toBe(events);
    });
  });

  describe('createEvent', () => {
    it('should create and return a new event', async () => {
      const eventData: CreateEventDto = { name: 'Test Event', date: new Date().toISOString(), location: 'Test Location' };
      const newEvent: DeepPartial<Event> = { id: 1, ...eventData };
      jest.spyOn(repository, 'create').mockReturnValue(newEvent as Event);
      jest.spyOn(repository, 'save').mockResolvedValue(newEvent as Event);

      expect(await service.createEvent(eventData)).toBe(newEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update and return the event', async () => {
      const updateData: Partial<UpdateEventDto> = { name: 'Updated Event' };
      const existingEvent: DeepPartial<Event> = { id: 1, name: 'Test Event', date: new Date() };
      const updatedEvent: DeepPartial<Event> = { ...existingEvent, ...updateData };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEvent as Event);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedEvent as Event);

      expect(await service.updateEvent(1, updateData)).toBe(updatedEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateEvent(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete and return the event', async () => {
      const existingEvent: DeepPartial<Event> = { id: 1, name: 'Test Event', date: new Date() };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEvent as Event);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingEvent as Event);

      expect(await service.deleteEvent(1)).toBe(existingEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteEvent(1)).rejects.toThrow(NotFoundException);
    });
  });
});
