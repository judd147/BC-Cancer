import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './events.controller';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { Donor } from '../donors/donor.entity';
import { ChangeHistoryModule } from '../change-history/change-history.module';
import { User } from '../users/user.entity';
import { EventDonor } from './event-donor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Donor, User, EventDonor]),
    ChangeHistoryModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
