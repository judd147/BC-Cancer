import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getAllEvents() {
    // Fetch all events via the service
    return this.eventService.getAllEvents();
  }

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Patch('/:id')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: Partial<UpdateEventDto>) {
    return this.eventService.updateEvent(parseInt(id), updateEventDto);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string) {
    await this.eventService.deleteEvent(parseInt(id));
    return { result: 'Event deleted' };
  }
}
