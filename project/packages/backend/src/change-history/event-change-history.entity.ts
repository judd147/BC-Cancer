import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

import { EventChangeHistory as IEventChangeHistory } from '@bc-cancer/shared/src/types';

export enum ActionType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

@Entity()
export class EventChangeHistory implements IEventChangeHistory {
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
  action: ActionType;

  @CreateDateColumn()
  timestamp: Date;

  @Column('json', { nullable: true })
  changes: Record<string, { old: any; new: any }>;
}
