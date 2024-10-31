import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from '../donors/donor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(@InjectRepository(Donor) private repo: Repository<Donor>) {}

  async onModuleInit() {
    await this.seedDonors();
  }

  private async seedDonors() {
    const donorsCount = await this.repo.count();
    if (donorsCount > 0) {
      this.logger.log('Donors already seeded. Skipping...');
      return;
    }

    const initialDonors: Partial<Donor>[] = [
      {
        pmm: 'PMM1',
        smm: 'SMM1',
        vmm: 'VMM1',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'Anytown',
        contactPhoneType: 'Mobile',
        totalDonations: 1000.0,
        totalPledge: 500.0,
        largestGift: 300.0,
        lastGiftAmount: 200.0,
        addressLine2: 'Apt 4B',
        // Add other required fields
      },
      {
        pmm: 'PMM2',
        smm: 'SMM2',
        vmm: 'VMM2',
        firstName: 'Jane',
        lastName: 'Smith',
        addressLine1: '456 Elm St',
        city: 'Othertown',
        contactPhoneType: 'Home',
        totalDonations: 2000.0,
        totalPledge: 1500.0,
        largestGift: 800.0,
        lastGiftAmount: 500.0,
        // Add other required fields
      },
      // Add more initial donors as needed
    ];

    try {
      await this.repo.save(initialDonors);
      this.logger.log('Initial donors have been seeded successfully.');
    } catch (error) {
      this.logger.error('Error seeding donors:', error);
    }
  }
}
