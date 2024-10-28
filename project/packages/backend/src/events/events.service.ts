import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private events = [];

  getAllEvents() {
    // placeholder 1
    return this.events;
  }

  createEvent(eventData: any) {
    // placeholder 2
    const newEvent = { id: Date.now(), ...eventData };
    this.events.push(newEvent);
    return newEvent;
  }
}
