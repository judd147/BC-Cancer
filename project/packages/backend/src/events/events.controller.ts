import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/:id')
  getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(parseInt(id));
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
    return this.eventService.createEvent(createEventDto, user);
  }

  @Patch('/:id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<UpdateEventDto>,
    @CurrentUser() user: User,
  ) {
    return this.eventService.updateEvent(parseInt(id), updateEventDto, user);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string, @CurrentUser() user: User) {
    await this.eventService.deleteEvent(parseInt(id), user);
    return { result: 'Event deleted' };
  }
}
