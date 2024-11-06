import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Donor } from '../donors/donor.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Donor) private donorsRepository: Repository<Donor>,
  ) {}

  async getEvent(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['donorsList'] });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['donorsList'] });
  }

  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const donorsList: Donor[] = [];
    if (eventData.donorsList) {
      donorsList.push(...await this.donorsRepository.find({ where: { id: In(eventData.donorsList) }}));
    }
    const newEvent = this.eventsRepository.create({ ...eventData, donorsList });
    return this.eventsRepository.save(newEvent);
  }

  async updateEvent(id: number, updateData: Partial<UpdateEventDto>): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const donorsList: Donor[] = [];
    if (updateData.donorsList) {
      donorsList.push(...await this.donorsRepository.find({ where: { id: In(updateData.donorsList) }}));
    }
    Object.assign(event, updateData, { donorsList });
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
