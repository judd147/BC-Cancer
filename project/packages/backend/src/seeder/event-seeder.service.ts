import { Injectable } from '@nestjs/common';
import { EventService } from 'src/events/events.service';
import { AuthService } from 'src/users/auth.service';

@Injectable()
export class EventSeederService {
  constructor(
    private readonly eventService: EventService,
    private readonly authService: AuthService,
  ) {}
}
