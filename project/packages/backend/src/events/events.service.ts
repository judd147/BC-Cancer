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
      tags: eventData.tags ?? [],
    });

    const savedEvent = await this.eventsRepository.save(newEvent);

    await this.changeHistoryService.logChange(
      savedEvent,
      user,
      'created',
      null,
      eventData.comment,
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

    const changes: Record<string, { old: any; new: any }> = {};
    for (const key of Object.keys(updateData)) {
      if (['admin'].includes(key)) {
        // handle changes of admins
        this.recordDiff(
          event[key],
          updateData[key],
          key,
          changes,
        );        
      } else if (['tags'].includes(key)) {
        // handle changes of tags
        const oldTags = event.tags ?? [];
        const newTags = updateData.tags ?? [];
        if (oldTags.sort().join(',') !== newTags.sort().join(',')) {
          changes[key] = { old: oldTags, new: newTags };
        }
        event[key] = newTags;
      } else if (['comment'].includes(key)) {
        // skip the comment key as it is for logging only
        continue;
      } else if (event[key] !== updateData[key]) {
        // Log the change
        changes[key] = { old: event[key], new: updateData[key] };
      }      
      event[key] = updateData[key];
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
    const { donorIds, newStatus, comment } = updateDonorsStatusDto;

    // Find the event with related EventDonor entries and donors
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['admins', 'createdBy', 'eventDonors', 'eventDonors.donor'],
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    if (this.userCanEditEvent(event, user)) {
      throw new ForbiddenException();
    }

    // Fetch existing EventDonor entries for these donors
    const eventDonors = await this.eventDonorRepository.find({
      where: { event: { id }, donor: In(donorIds) },
      relations: ['donor'],
    });

    if (eventDonors.length !== donorIds.length) {
      throw new BadRequestException('Some donors not found');
    }

    const changes: { [key in DonorStatus]: { old: number[]; new: number[] } } =
      {
        preview: { old: [], new: [] },
        invited: { old: [], new: [] },
        excluded: { old: [], new: [] },
      };

    eventDonors.forEach((donor) => {
      if (
        donor.status !== newStatus ||
        // check if the comment has changed
        // null, undefined, or empty string are considered the same
        (donor.comment ?? '') !== (comment ?? '')
      ) {
        changes[donor.status].old.push(donor.donor.id);
        changes[newStatus].new.push(donor.donor.id);
        Object.assign(donor, { status: newStatus, comment });
      }
    });

    if (
      Object.values(changes).every(
        (change) => change.old.length === 0 && change.new.length === 0,
      )
    ) {
      return;
    }

    await this.eventDonorRepository.save(eventDonors);

    await this.changeHistoryService.logChange(
      event,
      user,
      'updated',
      changes,
      comment,
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
      }
    }

    return donorsList;
  }
}
