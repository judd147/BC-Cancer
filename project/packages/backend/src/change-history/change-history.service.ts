import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventChangeHistory } from './event-change-history.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    // If the action is 'updated' and there are no changes, don't log anything
    if (action === ActionType.UPDATED && Object.keys(changes).length === 0) {
      return null;
    }
    return this.repo.save(history);
  }

  /**
   * Retrieves the change history for a specific event.
   * @param eventId The ID of the event.
   * @param userId The ID of the user to filter by (optional).
   */
  async getChangeHistoryForEvent(
    eventId: number,
    userId?: number,
  ): Promise<EventChangeHistory[]> {
    const where: FindOptionsWhere<EventChangeHistory> = {
      event: { id: eventId },
    };

    // If userId is provided, add it to the where condition
    if (userId) {
      where.user = { id: userId };
    }

    return this.repo.find({
      where,
      relations: ['user'],
      select: { user: { id: true, username: true } },
      withDeleted: true,
      order: { timestamp: 'DESC' },
    });
  }
}
