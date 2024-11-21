import { User } from '../users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { EventChangeHistory } from '../change-history/event-change-history.entity';
import { EventDonor } from './event-donor.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column()
  city: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @OneToMany(() => EventDonor, (eventDonor) => eventDonor.event, {
    cascade: true,
  })
  eventDonors: EventDonor[];

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value: string[]) => (value ? value.join(',') : ''),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  tags: string[];

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  admins: User[];

  @OneToMany(() => EventChangeHistory, (changeHistory) => changeHistory.event)
  changeHistories: EventChangeHistory[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
