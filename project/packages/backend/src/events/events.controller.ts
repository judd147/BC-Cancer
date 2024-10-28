import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Post()
  createEvent(@Body() createEventDto: any) {
    return this.eventService.createEvent(createEventDto);
  }
}
