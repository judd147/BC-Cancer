import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorSeederService } from './donor-seeder.service';
import { Donor } from '../donors/donor.entity';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { DonorsModule } from 'src/donors/donors.module';
import { Event } from 'src/events/event.entity';
import { EventChangeHistory } from 'src/change-history/event-change-history.entity';
import { User } from 'src/users/user.entity';
import { EventSeederService } from './event-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donor, Event, EventChangeHistory, User]),
    UsersModule,
    DonorsModule,
    EventsModule,
  ],
  providers: [DonorSeederService, EventSeederService],
  exports: [DonorSeederService],
})
export class SeederModule {}
