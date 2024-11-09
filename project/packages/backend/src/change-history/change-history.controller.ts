import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';

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
    @Query('userId') userId?: number,
  ) {
    return this.changeHistoryService.getChangeHistoryForEvent(eventId, userId);
  }
}