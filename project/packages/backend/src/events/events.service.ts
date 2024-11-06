import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Donor } from '../donors/donor.entity';
import { ChangeHistoryService } from '../change-history/change-history.service';
import { User } from '../users/user.entity';
import { ActionType } from '../change-history/event-change-history.entity';

const user: User = { id: 1, username: 'snjmfgr', password: 'password' } as User;

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Donor) private donorsRepository: Repository<Donor>,
    private readonly changeHistoryService: ChangeHistoryService,
  ) {}

  async getEvent(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['donorsList'],
    });
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
      donorsList.push(
        ...(await this.donorsRepository.find({
          where: { id: In(eventData.donorsList) },
        })),
      );
    }
    const newEvent = this.eventsRepository.create({ ...eventData, donorsList });
    const savedEvent = await this.eventsRepository.save(newEvent);

    await this.changeHistoryService.logChange(
      savedEvent,
      user,
      ActionType.CREATED,
    );

    return this.eventsRepository.save(newEvent);
  }

  async updateEvent(
    id: number,
    updateData: Partial<UpdateEventDto>,
  ): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['donorsList'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const donorsList: Donor[] = [];
    if (updateData.donorsList) {
      donorsList.push(
        ...(await this.donorsRepository.find({
          where: { id: In(updateData.donorsList) },
        })),
      );
    }

    const changes: Record<string, { old: any; new: any }> = {};
    for (const key of Object.keys(updateData)) {
      if (key === 'donorsList') {
        // handle donorsList separately
        continue;
      }
      // Compare the old and new values
      if (event[key] !== updateData[key]) {
        // Log the change
        changes[key] = { old: event[key], new: updateData[key] };
        event[key] = updateData[key];
      }
    }

    // Handle donorsList changes
    if (updateData.donorsList) {
      const oldDonors = event.donorsList.map((donor) => donor.id);
      const newDonors = donorsList.map((donor) => donor.id);
      const addedDonors = newDonors.filter((id) => !oldDonors.includes(id));
      const removedDonors = oldDonors.filter((id) => !newDonors.includes(id));

      if (addedDonors.length > 0 || removedDonors.length > 0) {
        changes['donorsList'] = {
          old: oldDonors,
          new: newDonors,
        };
        event.donorsList = donorsList;
      }
    }

    const updatedEvent = await this.eventsRepository.save(event);

    // Log the update action with changes
    await this.changeHistoryService.logChange(
      updatedEvent,
      user,
      ActionType.UPDATED,
      changes,
    );

    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const result = await this.eventsRepository.remove(event);
    await this.changeHistoryService.logChange(event, user, ActionType.DELETED);
    return result;
  }
}
