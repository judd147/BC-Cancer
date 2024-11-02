import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;
}
