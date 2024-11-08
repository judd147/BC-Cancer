import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventChangeHistory } from './event-change-history.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import { ActionType } from './event-change-history.entity';

@Injectable()
export class ChangeHistoryService {
  constructor(
    @InjectRepository(EventChangeHistory)
    private repo: Repository<EventChangeHistory>,
  ) {}

  /**
   * Logs a change to an event.
   * @param event The event being changed.
   * @param user The user performing the change.
   * @param action The type of action ('created', 'updated', etc.).
   * @param changes Detailed changes made (optional).
   */
  async logChange(
    event: Event,
    user: User,
    action: ActionType,
    changes?: Record<string, { old: any; new: any }>,
  ): Promise<EventChangeHistory> {
    const history = this.repo.create({ event, user, action, changes });
    return this.repo.save(history);
  }

  /**
   * Retrieves the change history for a specific event.
   * @param eventId The ID of the event.
   */
  async getChangeHistoryForEvent(
    eventId: number,
  ): Promise<EventChangeHistory[]> {
    return this.repo.find({
      where: { event: { id: eventId } },
      relations: ['user'],
      select: { user: { id: true, username: true } },
      withDeleted: true,
      order: { timestamp: 'DESC' },
    });
  }
}
