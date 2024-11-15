import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './events.controller';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event } from './event.entity';
import { DeepPartial } from 'typeorm';
import { User } from '../users/user.entity';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            getAllEvents: jest.fn(),
            createEvent: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const result: Event[] = [];
      jest.spyOn(service, 'getAllEvents').mockResolvedValue(result);

      expect(await controller.getAllEvents()).toBe(result);
    });
  });

  describe('createEvent', () => {
    it('should create and return a new event', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        date: new Date().toISOString(),
        addressLine1: '123 Test St',
        city: 'Test City',
        description: 'Test Description',
        donorIds: [1, 2],
      };
      const result: DeepPartial<Event> = {
        id: 1,
        ...createEventDto,
        eventDonors: [],
        admins: [],
      };
      jest.spyOn(service, 'createEvent').mockResolvedValue(result as Event);

      expect(
        await controller.createEvent(createEventDto, { id: 1 } as User),
      ).toBe(result);
    });
  });

  describe('updateEvent', () => {
    it('should update and return the event', async () => {
      const updateEventDto: Partial<UpdateEventDto> = { name: 'Updated Event' };
      const result: DeepPartial<Event> = {
        id: 1,
        name: 'Updated Event',
        date: new Date(),
      };
      jest.spyOn(service, 'updateEvent').mockResolvedValue(result as Event);

      expect(
        await controller.updateEvent(1, updateEventDto, { id: 1 } as User),
      ).toBe(result);
    });
  });

  describe('deleteEvent', () => {
    it('should delete and return the event', async () => {
      jest.spyOn(service, 'deleteEvent').mockResolvedValue({ id: 1 } as Event);

      expect(await controller.deleteEvent(1, { id: 1 } as User)).toMatchObject({
        result: 'Event deleted',
      });
    });
  });
});
