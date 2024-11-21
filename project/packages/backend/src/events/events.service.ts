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
import {
  Event as EventResponse,
  // donorStatuses, // BUG: import this will cause MODULE_NOT_FOUND error
  DonorsList,
  DonorStatus,
} from '@bc-cancer/shared/src/types';
import { EventDonor } from './event-donor.entity';
import { UpdateDonorsStatusDto } from './dtos/update-donor-status.dto';

export const donorStatuses = ['preview', 'invited', 'excluded'] as const;

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Donor) private donorsRepository: Repository<Donor>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(EventDonor)
    private eventDonorRepository: Repository<EventDonor>,
    private readonly changeHistoryService: ChangeHistoryService,
  ) {}

  async getEvent(id: number): Promise<EventResponse> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['admins', 'createdBy'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getAllEvents(): Promise<EventResponse[]> {
    return this.eventsRepository.find({ relations: ['admins', 'createdBy'] });
  }

  async createEvent(
    eventData: CreateEventDto,
    user: User,
  ): Promise<EventResponse> {
    const admins = await this.usersRepository.find({
      where: { id: In(eventData.admins ?? []) },
    });

    const invitedDonors = await this.donorsRepository.find({
      where: { id: In(eventData.donorIds) },
    });

    const eventDonors: EventDonor[] = invitedDonors.map((donor) => {
      return this.eventDonorRepository.create({
        donor,
        status: 'preview',
      });
    });

    const newEvent = this.eventsRepository.create({
      ...eventData,
      eventDonors,
      createdBy: user,
      admins,
    });

    const savedEvent = await this.eventsRepository.save(newEvent);

    await this.changeHistoryService.logChange(savedEvent, user, 'created');

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
  ): Promise<EventResponse> {
    // Find the event by ID
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['admins', 'createdBy'],
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

    const admins: User[] = [
      ...(await this.usersRepository.find({
        where: { id: In([...(updateData.admins ?? [])]) },
      })),
    ];

    const changes: Record<string, { old: any; new: any }> = {};
    for (const key of Object.keys(updateData)) {
      if (['admins'].includes(key)) {
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
      'updated',
      changes,
      updateData.comment,
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

    await this.changeHistoryService.logChange(event, user, 'deleted');
    await this.eventsRepository.softRemove(event);
    return event;
  }

  async updateDonorsStatus(
    id: number,
    updateDonorsStatusDto: UpdateDonorsStatusDto,
    user: User,
  ) {
    const { donorIds, newStatus } = updateDonorsStatusDto;

    // Validate newStatus
    if (!Object.values(donorStatuses).includes(newStatus)) {
      throw new BadRequestException('Invalid status provided');
    }

    // Find the event with related EventDonor entries and donors
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['admins', 'createdBy', 'eventDonors', 'eventDonors.donor'],
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException(
        `${user.username} is not allowed to edit this event`,
      );
    }

    const donors = await this.donorsRepository.findBy({
      id: In(donorIds),
    });

    if (donors.length !== donorIds.length) {
      throw new NotFoundException('Some donors not found');
    }

    // Fetch existing EventDonor entries for these donors
    const existingEventDonors = await this.eventDonorRepository.find({
      where: {
        event: { id },
        donor: In(donorIds),
      },
      relations: ['donor'],
    });

    // Determine donors to update and donors to add
    const existingDonorIds = existingEventDonors.map((ed) => ed.donor.id);

    // Identify donorIds that are not associated with the event
    const invalidDonorIds = donorIds.filter(
      (donorId) => !existingDonorIds.includes(donorId),
    );

    if (invalidDonorIds.length > 0) {
      throw new BadRequestException(
        `Donors with IDs [${invalidDonorIds.join(', ')}] are not associated with this event`,
      );
    }

    const donorsToUpdate = existingEventDonors;
    const donorsToAdd = donors.filter(
      (donor) => !existingDonorIds.includes(donor.id),
    );

    const changes: { [key in DonorStatus]?: { old: number[]; new: number[] } } =
      {};

    // Capture the current donors categorized by status
    const oldDonorsList = {
      preview: [],
      invited: [],
      excluded: [],
    };

    event.eventDonors.forEach((ed) => {
      if (Object.values(donorStatuses).includes(ed.status)) {
        oldDonorsList[ed.status].push(ed.donor.id);
      }
    });

    // Update existing donors' status
    const updatedDonorIds: number[] = [];
    for (const eventDonor of donorsToUpdate) {
      // Update the status and comment if they have changed
      if (
        eventDonor.status !== newStatus ||
        eventDonor.comment !== updateDonorsStatusDto.comment
      ) {
        eventDonor.status = newStatus;
        updatedDonorIds.push(eventDonor.donor.id);
        eventDonor.comment = updateDonorsStatusDto.comment;
        await this.eventDonorRepository.save(eventDonor);
      }
    }

    // Add new EventDonor entries for donors not previously associated
    if (donorsToAdd.length > 0) {
      const newEventDonors = donorsToAdd.map((donor) =>
        this.eventDonorRepository.create({
          event,
          donor,
          status: newStatus,
        }),
      );
      await this.eventDonorRepository.save(newEventDonors);
      updatedDonorIds.push(...donorsToAdd.map((donor) => donor.id));
    }

    // If no donors were updated or added, return the event as is
    if (updatedDonorIds.length === 0) {
      return event;
    }

    // Fetch the updated donors categorized by status
    const updatedEventDonors = await this.eventDonorRepository.find({
      where: { event: { id } },
      relations: ['donor'],
    });

    const newDonorsList = {
      preview: [],
      invited: [],
      excluded: [],
    };

    updatedEventDonors.forEach((ed) => {
      if (Object.values(donorStatuses).includes(ed.status)) {
        newDonorsList[ed.status].push(ed.donor.id);
      }
    });

    // Compare old and new donors lists to populate changes
    for (const status of Object.values(donorStatuses)) {
      const oldList = oldDonorsList[status].sort((a, b) => a - b);
      const newList = newDonorsList[status].sort((a, b) => a - b);

      const oldSet = new Set(oldList);
      const newSet = new Set(newList);

      const added = newList.filter((id) => !oldSet.has(id));
      const removed = oldList.filter((id) => !newSet.has(id));

      if (added.length > 0 || removed.length > 0) {
        changes[status] = {
          old: oldList,
          new: newList,
        };
      }
    }

    // Log the update action with categorized changes
    this.changeHistoryService.logChange(
      event,
      user,
      'updated',
      changes,
      updateDonorsStatusDto.comment,
    );
  }

  async getEventDonors(id: number): Promise<DonorsList> {
    // Fetch the event with related EventDonors and Donors
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['eventDonors', 'eventDonors.donor'],
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    // Initialize the DonorsList with empty arrays for each status
    const donorsList: DonorsList = {
      preview: [],
      invited: [],
      excluded: [],
    };

    // Iterate over each EventDonor and categorize the donors
    for (const eventDonor of event.eventDonors) {
      // Ensure the status is valid
      if (Object.values(donorStatuses).includes(eventDonor.status)) {
        donorsList[eventDonor.status].push({
          ...eventDonor.donor,
          comment: eventDonor.comment,
        });
        console.log(eventDonor.comment);
      }
    }

    return donorsList;
  }
}
