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
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { DonorsList, Event } from '@bc-cancer/shared/src/types';
import { UpdateDonorsStatusDto } from './dtos/update-donor-status.dto';

@Controller('events')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/:id')
  getEvent(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventService.getEvent(id);
  }

  @Get()
  getAllEvents(): Promise<Event[]> {
    return this.eventService.getAllEvents();
  }

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventService.createEvent(createEventDto, user);
  }

  @Patch('/:id')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: Partial<UpdateEventDto>,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventService.updateEvent(id, updateEventDto, user);
  }

  @Delete('/:id')
  async deleteEvent(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.eventService.deleteEvent(id, user);
    return { result: 'Event deleted' };
  }

  @Patch('/:id/donors')
  async updateDonorsStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonorsStatusDto: UpdateDonorsStatusDto,
    @CurrentUser() user: User,
  ) {
    await this.eventService.updateDonorsStatus(id, updateDonorsStatusDto, user);
    return { result: 'Donors updated' };
  }

  @Get('/:id/donors')
  getEventDonors(@Param('id', ParseIntPipe) id: number): Promise<DonorsList> {
    return this.eventService.getEventDonors(id);
  }
}
