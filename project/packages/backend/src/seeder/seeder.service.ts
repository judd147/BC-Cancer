// src/seeder/seeder.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from '../donors/donor.entity'; // Adjust the path as necessary
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  private readonly TOTAL_DONORS = 500;

  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {}

  async onModuleInit() {
    await this.seedDonorsIfNeeded();
  }

  async seedDonorsIfNeeded() {
    const donorsCount = await this.donorRepository.count();
    if (donorsCount >= this.TOTAL_DONORS) {
      this.logger.log(
        `Donors already seeded with ${donorsCount} entries. Skipping seeding.`,
      );
      return;
    }
    await this.seedDonors();
  }

  private async seedDonors() {
    const donorsCount = await this.donorRepository.count();
    if (donorsCount >= this.TOTAL_DONORS) {
      this.logger.log(
        `Donors already seeded with ${donorsCount} entries. Skipping seeding.`,
      );
      return;
    }

    const donorsToCreate = this.TOTAL_DONORS - donorsCount;
    this.logger.log(`Seeding ${donorsToCreate} donors...`);

    const initialDonors: Partial<Donor>[] = [];

    const bcCities = [
      "Abbotsford",
      "Armstrong",
      "Burnaby",
      "Campbell River",
      "Castlegar",
      "Chilliwack",
      "Colwood",
      "Coquitlam",
      "Courtenay",
      "Cranbrook",
      "Dawson Creek",
      "Delta",
      "Duncan",
      "Enderby",
      "Fernie",
      "Fort St. John",
      "Grand Forks",
      "Greenwood",
      "Kamloops",
      "Kelowna",
      "Kimberley",
      "Langford",
      "Langley",
      "Maple Ridge",
      "Merritt",
      "Mission",
      "Nanaimo",
      "Nelson",
      "New Westminster",
      "North Vancouver",
      "Parksville",
      "Penticton",
      "Pitt Meadows",
      "Port Alberni",
      "Port Coquitlam",
      "Port Moody",
      "Powell River",
      "Prince George",
      "Prince Rupert",
      "Quesnel",
      "Revelstoke",
      "Richmond",
      "Rossland",
      "Salmon Arm",
      "Surrey",
      "Terrace",
      "Trail",
      "Vancouver",
      "Vernon",
      "Victoria",
      "West Kelowna",
      "White Rock",
      "Williams Lake"
    ];

    const interests = [
      "Bladder Cancer",
      "Breast Cancer",
      "Colon and Rectal Cancer",
      "Endometrial Cancer",
      "Kidney Cancer",
      "Leukemia",
      "Liver",
      "Lung Cancer",
      "Melanoma",
      "Non-Hodgkin Lymphoma",
      "Pancreatic Cancer",
      "Prostate Cancer",
      "Thyroid Cancer"
    ];

    for (let i = 0; i < donorsToCreate; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const donor: Partial<Donor> = {
        pmm: faker.person.fullName(),
        smm: faker.person.fullName(),
        vmm: faker.person.fullName(),
        firstName: firstName,
        lastName: lastName,
        nickName: faker.helpers.arrayElement([faker.person.firstName(), null]),
        exclude: faker.datatype.boolean(),
        deceased: faker.datatype.boolean(),
        organizationName: faker.datatype.boolean()
          ? faker.company.name()
          : null,
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.datatype.boolean()
          ? faker.location.secondaryAddress()
          : null,
        city: faker.helpers.arrayElement(bcCities),
        interests: faker.helpers.shuffle(interests).slice(0, randomInt(0, 7)),
        contactPhoneType: faker.helpers.arrayElement([
          'Mobile',
          'Home',
          'Work',
        ]),
        phoneRestrictions: faker.helpers.arrayElement([
          null,
          'Do Not Call',
          'No Surveys',
          'No Mass Communications',
          'No Mass Appeals',
        ]),
        emailRestrictions: faker.helpers.arrayElement([
          null,
          'Do Not Email',
          'No Surveys',
          'No Mass Communications',
          'No Mass Appeals',
        ]),
        communicationRestrictions: faker.helpers.arrayElement([
          null,
          'No Mass Communications',
          'No Survey',
          'No Mass Appeals',
        ]),
        communicationPreference: faker.helpers.arrayElement([
          'Event',
          'Inspiration event',
          'Appeal',
          'Magazine',
          'Survey',
          'Holiday Card',
          null,
        ]),
        subscriptionEventsInPerson: faker.datatype.boolean(),
        subscriptionEventsMagazine: faker.datatype.boolean(),
        totalDonations: parseFloat(
          faker.finance.amount({ min: 0, max: 1000000 }),
        ),
        totalPledge: parseFloat(faker.finance.amount({ min: 0, max: 1000000 })),
        largestGift: parseFloat(faker.finance.amount({ min: 0, max: 1000000 })),
        lastGiftAmount: parseFloat(
          faker.finance.amount({ min: 0, max: 1000000 }),
        ),
        largestGiftAppeal: faker.datatype.boolean()
          ? faker.lorem.sentence()
          : null,
        firstGiftDate: faker.date.past({ years: 10 }),
        lastGiftDate: faker.date.past({ years: 1 }),
        lastGiftRequest: faker.datatype.boolean() ? faker.date.future() : null,
        lastGiftAppeal: faker.datatype.boolean()
          ? faker.lorem.sentence()
          : null,
      };

      initialDonors.push(donor);
    }

    try {
      // Insert donors in batches to improve performance
      const BATCH_SIZE = 100;
      for (let i = 0; i < initialDonors.length; i += BATCH_SIZE) {
        const batch = initialDonors.slice(i, i + BATCH_SIZE);
        await this.donorRepository.save(batch);
        this.logger.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}`);
      }

      this.logger.log(`Successfully seeded ${initialDonors.length} donors.`);
    } catch (error) {
      this.logger.error('Error seeding donors:', error);
    }
  }
}
