import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

@Entity()
export class EventChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.changeHistories, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @ManyToOne(() => User, (user) => user.changeHistories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column()
  action: string; // e.g., 'created', 'updated'

  @CreateDateColumn()
  timestamp: Date;

  @Column('json', { nullable: true })
  changes: Record<string, { old: any; new: any }>;
}
