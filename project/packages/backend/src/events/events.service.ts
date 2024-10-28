import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const newEvent = this.eventsRepository.create(eventData);
    return this.eventsRepository.save(newEvent);
  }
}
