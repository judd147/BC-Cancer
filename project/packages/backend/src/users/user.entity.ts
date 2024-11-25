import { Exclude } from 'class-transformer';
import { EventChangeHistory } from '../change-history/event-change-history.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ name: 'is_admin', default: false })
  admin: boolean;

  @OneToMany(() => EventChangeHistory, (changeHistory) => changeHistory.user)
  changeHistories: EventChangeHistory[];
}
