import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './events.controller';
import { EventService } from './events.service';
import { Event } from './event.entity';
import { Donor } from '../donors/donor.entity';
import { ChangeHistoryModule } from '../change-history/change-history.module';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Donor, User]), ChangeHistoryModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
