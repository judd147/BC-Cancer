import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Donor } from '../donors/donor.entity';
import { ChangeHistoryService } from '../change-history/change-history.service';
import { User } from '../users/user.entity';
import { ActionType } from '../change-history/event-change-history.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Donor) private donorsRepository: Repository<Donor>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly changeHistoryService: ChangeHistoryService,
  ) {}

  async getEvent(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['donorsList', 'changeHistories', 'admins'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['donorsList', 'changeHistories', 'admins'],
    });
  }

  async createEvent(eventData: CreateEventDto, user: User): Promise<Event> {
    const donorsList: Donor[] = [];
    const admins: User[] = [];
    admins.push(
      ...(await this.usersRepository.find({
        where: { id: In([...eventData.admins ?? []]) },
      })),
    );
    donorsList.push(
      ...(await this.donorsRepository.find({
        where: { id: In([...eventData.donorsList ?? []]) },
      })),
    );
    const newEvent = this.eventsRepository.create({
      ...eventData,
      donorsList,
      createdBy: user,
      admins,
    });
    const savedEvent = await this.eventsRepository.save(newEvent);

    await this.changeHistoryService.logChange(
      savedEvent,
      user,
      ActionType.CREATED,
    );

    return savedEvent;
  }

  recordDiff<T extends Donor | User>(
    oldListOfData: T[] = [],
    newListOfData: T[] = [],
    key: string,
    changes: Record<string, { old: any; new: any }>,
  ) {
    const oldDataList = oldListOfData.map((el) => el.id);
    const newDataList = newListOfData.map((el) => el.id);
    const addedItems = newDataList.filter((id) => !oldDataList.includes(id));
    const removedItems = oldDataList.filter((id) => !newDataList.includes(id));

    if (addedItems.length > 0 || removedItems.length > 0) {
      changes[key] = {
        old: oldDataList,
        new: newDataList,
      };
    }
  }

  userCanEditEvent = (event: Event, user: User): boolean =>
    user.id !== event.createdBy.id &&
    !event.admins.some((admin) => admin.id === user.id) &&
    !user.admin;

  async updateEvent(
    id: number,
    updateData: Partial<UpdateEventDto>,
    user: User,
  ): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['donorsList', 'admins'],
    });
    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    // Check if the user can edit the event
    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(`${user.username} is not allowed to edit this event`);
    }

    const donorsList: Donor[] = [
      ...(await this.donorsRepository.find({
        where: { id: In([...updateData.donorsList ?? []]) },
      })),
    ];
    const admins: User[] = [
      ...(await this.usersRepository.find({
        where: { id: In([...updateData.admins ?? []]) },
      })),
    ];

    const changes: Record<string, { old: any; new: any }> = {};
    for (const key of Object.keys(updateData)) {
      if (['donorsList', 'admins'].includes(key)) {
        // handle donorsList and admins separately
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
      this.recordDiff(event.donorsList, donorsList, 'donorsList', changes);
      event.donorsList = donorsList;
    }

    // Handle admins changes
    if (updateData.admins) {
      this.recordDiff(event.admins, admins, 'admins', changes);
      event.admins = admins;
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

  async deleteEvent(id: number, user: User): Promise<Event> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if the user can edit the event
    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(`${user.username} is not allowed to delete this event`);
    }

    await this.changeHistoryService.logChange(event, user, ActionType.DELETED);
    await this.eventsRepository.softRemove(event);
    return event;
  }
}
