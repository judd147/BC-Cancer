import { EventChangeHistory } from 'src/change-history/event-change-history.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  // OneToMany,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'is_admin', default: false })
  admin: boolean;

  @OneToMany(() => EventChangeHistory, (changeHistory) => changeHistory.user)
  changeHistories: EventChangeHistory[];

  @AfterInsert()
  logInsert() {
    console.log(
      'Inserted User with id',
      this.id,
      'and username',
      this.username,
    );
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id, 'and username', this.username);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id, 'and username', this.username);
  }
}
