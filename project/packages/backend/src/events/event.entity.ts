import { Event as EventInterface} from '@bc-cancer/shared/src/types';
import { Donor } from '../donors/donor.entity';
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

@Entity()
export class Event implements EventInterface {
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

  @ManyToMany(() => Donor, { cascade: true })
  @JoinTable()
  donorsList?: Donor[];

  @ManyToOne(() => User, { cascade: true })
  createdBy: User;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  admins: User[];

  @OneToMany(() => EventChangeHistory, (changeHistory) => changeHistory.event)
  changeHistories: EventChangeHistory[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
