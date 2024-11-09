import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/:id')
  getEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEvent(id);
  }

  @Get()
  getAllEvents() {
    // Fetch all events via the service
    return this.eventService.getAllEvents();
  }

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    const admins = createEventDto.admins ?? [];
    createEventDto.admins = [...new Set(admins)];
    return this.eventService.createEvent(createEventDto, user);
  }

  @Patch('/:id')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: Partial<UpdateEventDto>,
    @CurrentUser() user: User,
  ) {
    return this.eventService.updateEvent(id, updateEventDto, user);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    await this.eventService.deleteEvent(id, user);
    return { result: 'Event deleted' };
  }
}
