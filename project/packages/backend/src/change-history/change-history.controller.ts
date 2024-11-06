import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';

@Controller('events/:eventId/history')
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  /**
   * Retrieves the change history for a specific event.
   * @param eventId The ID of the event.
   */
  @Get()
  async getHistory(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.changeHistoryService.getChangeHistoryForEvent(eventId);
  }
}
