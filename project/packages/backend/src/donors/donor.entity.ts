import { Donor as DonorInterface } from '@bc-cancer/shared/src/types';
import { EventDonor } from '../events/event-donor.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Donor implements DonorInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pmm: string;

  @Column()
  smm: string;

  @Column()
  vmm: string;

  @Column({ default: false })
  exclude: boolean;

  @Column({ default: false })
  deceased: boolean;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  nickName?: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  organizationName?: string;

  @Column({ type: 'real', precision: 15, scale: 2, default: 0 })
  totalDonations: number;

  @Column({ type: 'real', precision: 15, scale: 2, default: 0 })
  totalPledge: number;

  @Column({ type: 'real', precision: 15, scale: 2, default: 0 })
  largestGift: number;

  @Column({ nullable: true })
  largestGiftAppeal?: string;

  @Column({ type: 'datetime', nullable: true })
  firstGiftDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastGiftDate?: Date;

  @Column({ type: 'real', precision: 15, scale: 2, default: 0 })
  lastGiftAmount: number;

  @Column({ type: 'datetime', nullable: true })
  lastGiftRequest?: Date;

  @Column({ nullable: true })
  lastGiftAppeal?: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column()
  city: string;

  @Column()
  contactPhoneType: string;

  @Column({ nullable: true })
  phoneRestrictions?: string;

  @Column({ nullable: true })
  emailRestrictions?: string;

  @Column({ nullable: true })
  communicationRestrictions?: string;

  @Column({ default: false })
  subscriptionEventsInPerson: boolean;

  @Column({ default: false })
  subscriptionEventsMagazine: boolean;

  @Column({ nullable: true })
  communicationPreference?: string;

  @OneToMany(() => EventDonor, (eventDonor) => eventDonor.donor, {
    cascade: true,
  })
  eventDonors: EventDonor[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  interests: string[];
}
