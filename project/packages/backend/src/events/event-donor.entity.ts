import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { Donor } from '../donors/donor.entity';
import { DonorStatus } from '@bc-cancer/shared/src/types';

@Entity()
@Unique(['event', 'donor']) // Ensure a donor is linked to an event only once
export class EventDonor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.eventDonors, { onDelete: 'CASCADE' })
  event: Event;

  @ManyToOne(() => Donor, (donor) => donor.eventDonors, { onDelete: 'CASCADE' })
  donor: Donor;

  @Column({ type: 'text' })
  status: DonorStatus;

  @Column({ type: 'text', nullable: true })
  comment?: string;
}
