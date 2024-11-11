import {
  BadRequestException,
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
import { UpdateDonorsStatusDto } from '@bc-cancer/shared/types';

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
      relations: [
        'donorsList',
        'changeHistories',
        'admins',
        'createdBy',
        'excludedDonors',
      ],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: [
        'donorsList',
        'changeHistories',
        'admins',
        'createdBy',
        'excludedDonors',
      ],
    });
  }

  async createEvent(eventData: CreateEventDto, user: User): Promise<Event> {
    const donorsList: Donor[] = [];
    const excludedDonors: Donor[] = [];
    const admins: User[] = [];
    admins.push(
      ...(await this.usersRepository.find({
        where: { id: In([...(eventData.admins ?? [])]) },
      })),
    );
    donorsList.push(
      ...(await this.donorsRepository.find({
        where: { id: In([...(eventData.donorsList ?? [])]) },
      })),
    );
    excludedDonors.push(
      ...(await this.donorsRepository.find({
        where: { id: In([...(eventData.excludedDonors ?? [])]) },
      })),
    );
    const newEvent = this.eventsRepository.create({
      ...eventData,
      donorsList,
      excludedDonors,
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
      relations: ['donorsList', 'admins', 'createdBy', 'excludedDonors'],
    });
    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    // Check if the user can edit the event
    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(
        `${user.username} is not allowed to edit this event`,
      );
    }

    const donorsList: Donor[] = [
      ...(await this.donorsRepository.find({
        where: { id: In([...(updateData.donorsList ?? [])]) },
      })),
    ];
    const excludedDonors: Donor[] = [
      ...(await this.donorsRepository.find({
        where: { id: In([...(updateData.excludedDonors ?? [])]) },
      })),
    ];
    const admins: User[] = [
      ...(await this.usersRepository.find({
        where: { id: In([...(updateData.admins ?? [])]) },
      })),
    ];

    const changes: Record<string, { old: any; new: any }> = {};
    for (const key of Object.keys(updateData)) {
      if (['donorsList', 'admins', 'excludedDonors'].includes(key)) {
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

    // Handle excludedDonors changes
    if (updateData.excludedDonors) {
      this.recordDiff(
        event.excludedDonors,
        excludedDonors,
        'excludedDonors',
        changes,
      );
      event.excludedDonors = excludedDonors;
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
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['admins', 'createdBy'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if the user can edit the event
    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(
        `${user.username} is not allowed to delete this event`,
      );
    }

    await this.changeHistoryService.logChange(event, user, ActionType.DELETED);
    await this.eventsRepository.softRemove(event);
    return event;
  }

  async updateDonorsStatus(
    id: number,
    updateDonorsStatusDto: UpdateDonorsStatusDto,
    user: User,
  ) {
    const { donorIds, newStatus } = updateDonorsStatusDto;

    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['donorsList', 'excludedDonors', 'admins', 'createdBy'],
    });

    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(
        `${user.username} is not allowed to edit this event`,
      );
    }

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    const donors = await this.donorsRepository.findBy({
      id: In(donorIds),
    });

    if (donors.length !== donorIds.length) {
      throw new NotFoundException('Some donors not found');
    }

    const changes: Record<string, { old: any; new: any }> = {};

    const recordChange = (
      key: string,
      oldList: number[],
      newList: number[],
    ) => {
      if (JSON.stringify(oldList.sort()) !== JSON.stringify(newList.sort())) {
        changes[key] = { old: oldList, new: newList };
      }
    };

    const currentDonorsListIds = event.donorsList.map((donor) => donor.id);
    const currentExcludedDonorsIds = event.excludedDonors.map(
      (donor) => donor.id,
    );

    switch (newStatus) {
      case 'excluded':
        {
          const updatedExcludedDonors = [
            ...event.excludedDonors,
            ...donors.filter(
              (donor) => !currentExcludedDonorsIds.includes(donor.id),
            ),
          ];

          // Remove from donorsList
          const updatedDonorsList = event.donorsList.filter(
            (donor) => !donorIds.includes(donor.id),
          );

          recordChange(
            'excludedDonors',
            currentExcludedDonorsIds,
            updatedExcludedDonors.map((donor) => donor.id),
          );
          recordChange(
            'donorsList',
            currentDonorsListIds,
            updatedDonorsList.map((donor) => donor.id),
          );

          event.excludedDonors = updatedExcludedDonors;
          event.donorsList = updatedDonorsList;
        }
        break;

      case 'invited':
        {
          const updatedDonorsList = [
            ...event.donorsList,
            ...donors.filter(
              (donor) => !currentDonorsListIds.includes(donor.id),
            ),
          ];

          // Remove from excludedDonors
          const updatedExcludedDonors = event.excludedDonors.filter(
            (donor) => !donorIds.includes(donor.id),
          );

          // Record changes
          recordChange(
            'donorsList',
            currentDonorsListIds,
            updatedDonorsList.map((donor) => donor.id),
          );
          recordChange(
            'excludedDonors',
            currentExcludedDonorsIds,
            updatedExcludedDonors.map((donor) => donor.id),
          );

          // Update event relations
          event.donorsList = updatedDonorsList;
          event.excludedDonors = updatedExcludedDonors;
        }
        break;

      case 'preview':
        {
          // Remove from both donorsList and excludedDonors
          const updatedDonorsList = event.donorsList.filter(
            (donor) => !donorIds.includes(donor.id),
          );
          const updatedExcludedDonors = event.excludedDonors.filter(
            (donor) => !donorIds.includes(donor.id),
          );

          // Record changes
          recordChange(
            'donorsList',
            currentDonorsListIds,
            updatedDonorsList.map((donor) => donor.id),
          );
          recordChange(
            'excludedDonors',
            currentExcludedDonorsIds,
            updatedExcludedDonors.map((donor) => donor.id),
          );

          // Update event relations
          event.donorsList = updatedDonorsList;
          event.excludedDonors = updatedExcludedDonors;
        }
        break;

      default:
        throw new BadRequestException('Invalid status provided');
    }

    // If no changes detected, return the event as is
    if (Object.keys(changes).length === 0) {
      return event;
    }

    const updatedEvent = await this.eventsRepository.save(event);

    await this.changeHistoryService.logChange(
      updatedEvent,
      user,
      ActionType.UPDATED,
      changes,
    );

    return updatedEvent;
  }
}
