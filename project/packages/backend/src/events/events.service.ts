import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

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
    return this.eventsRepository.save(newEvent);
  }

  async updateEvent(id: number, updateData: UpdateEventDto): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(event, updateData);
    return this.eventsRepository.save(event);
  }
}
