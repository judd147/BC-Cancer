import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';
import { EventChangeHistory } from '@bc-cancer/shared/src/types';

@Controller('events/:eventId/history')
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  /**
   * Retrieves the change history for a specific event.
   * @param eventId The ID of the event.
   * @param userId The ID of the user to filter by (optional).
   */
  @Get()
  async getHistory(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
  ): Promise<EventChangeHistory[]> {
    return this.changeHistoryService.getChangeHistoryForEvent(eventId, userId);
  }
}
