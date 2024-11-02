import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { getCoordinates } from '../utils/coordinates.utils';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const newEvent = this.eventsRepository.create(eventData);
    // Get the coordinates from the location
    const coordinates = await getCoordinates(eventData.location);
    newEvent.latitude = coordinates.lat;
    newEvent.longitude = coordinates.lon;
    return this.eventsRepository.save(newEvent);
  }

  async updateEvent(id: number, updateData: Partial<UpdateEventDto>): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    Object.assign(event, updateData);
    if (updateData.location) {
      // Get the coordinates from the location
      const coordinates = await getCoordinates(event.location);
      event.latitude = coordinates.lat;
      event.longitude = coordinates.lon;
    }
    return this.eventsRepository.save(event);
  }

  async deleteEvent(id: number): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const result = await this.eventsRepository.remove(event);
    return result;
  }
}
