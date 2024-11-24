import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from '../donors/donor.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

interface City {
  name: string;
  lat: number;
  lng: number;
}

const BC_CITIES: { [key: string]: City } = {
  Abbotsford: { name: 'Abbotsford', lat: 49.05798, lng: -122.25257 },
  Armstrong: { name: 'Armstrong', lat: 50.44861, lng: -119.19833 },
  Burnaby: { name: 'Burnaby', lat: 49.26636, lng: -122.95263 },
  'Campbell River': {
    name: 'Campbell River',
    lat: 50.01634,
    lng: -125.24459,
  },
  Castlegar: { name: 'Castlegar', lat: 49.32555, lng: -117.66607 },
  Chilliwack: { name: 'Chilliwack', lat: 49.17468, lng: -121.94426 },
  Colwood: { name: 'Colwood', lat: 48.43333, lng: -123.48333 },
  Coquitlam: { name: 'Coquitlam', lat: 49.28376, lng: -122.79321 },
  Courtenay: { name: 'Courtenay', lat: 49.6866, lng: -124.99326 },
  Cranbrook: { name: 'Cranbrook', lat: 49.51368, lng: -115.76879 },
  'Dawson Creek': { name: 'Dawson Creek', lat: 55.76667, lng: -120.23333 },
  Delta: { name: 'Delta', lat: 49.14399, lng: -123.96175 },
  Duncan: { name: 'Duncan', lat: 48.7768, lng: -123.70737 },
  Enderby: { name: 'Enderby', lat: 50.5501, lng: -119.13838 },
  Fernie: { name: 'Fernie', lat: 49.50417, lng: -115.06333 },
  'Fort St. John': {
    name: 'Fort St. John',
    lat: 56.24999,
    lng: -120.84991,
  },
  'Grand Forks': { name: 'Grand Forks', lat: 49.03333, lng: -118.43333 },
  Greenwood: { name: 'Greenwood', lat: 49.1, lng: -118.68333 },
};

const INTERESTS: string[] = [
  'Bladder Cancer',
  'Breast Cancer',
  'Colon and Rectal Cancer',
  'Endometrial Cancer',
  'Kidney Cancer',
  'Leukemia',
  'Liver',
  'Lung Cancer',
  'Melanoma',
  'Non-Hodgkin Lymphoma',
  'Pancreatic Cancer',
  'Prostate Cancer',
  'Thyroid Cancer',
];

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Generates a randomized coordinate within a specified maximum distance from the center.
 * @param centerLat - The latitude of the city center.
 * @param centerLng - The longitude of the city center.
 * @param maxDistanceKm - The maximum distance in kilometers from the center.
 * @returns An object containing the randomized latitude and longitude.
 */
function randomizeCoordinates(
  centerLat: number,
  centerLng: number,
  maxDistanceKm: number = 5,
): { lat: number; lng: number } {
  // Convert max distance from km to radians
  const maxDistanceRad = maxDistanceKm / 6371; // Earth's radius in km

  // Generate two random numbers
  const rand1 = Math.random();
  const rand2 = Math.random();

  // Random distance and angle
  const distanceRad = Math.acos(1 - rand1 + rand1 * Math.cos(maxDistanceRad));
  const angle = 2 * Math.PI * rand2;

  // Calculate the new latitude
  const newLat = Math.asin(
    Math.sin(degreesToRadians(centerLat)) * Math.cos(distanceRad) +
      Math.cos(degreesToRadians(centerLat)) *
        Math.sin(distanceRad) *
        Math.cos(angle),
  );

  // Calculate the new longitude
  const newLng =
    degreesToRadians(centerLng) +
    Math.atan2(
      Math.sin(angle) *
        Math.sin(distanceRad) *
        Math.cos(degreesToRadians(centerLat)),
      Math.cos(distanceRad) -
        Math.sin(degreesToRadians(centerLat)) * Math.sin(newLat),
    );

  return {
    lat: radiansToDegrees(newLat),
    lng: radiansToDegrees(newLng),
  };
}

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  private readonly TOTAL_DONORS = 500;
  private readonly BATCH_SIZE = 100;
  private readonly MAX_DISTANCE_KM = 5; // Maximum distance from city center

  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {}

  async onModuleInit() {
    await this.seedDonorsIfNeeded();
  }

  /**
   * Seeds donors if the current count is below the total desired donors.
   */
  async seedDonorsIfNeeded(): Promise<void> {
    try {
      const donorsCount = await this.donorRepository.count();
      if (donorsCount >= this.TOTAL_DONORS) {
        this.logger.log(
          `Donors already seeded with ${donorsCount} entries. Skipping seeding.`,
        );
        return;
      }
      await this.seedDonors(donorsCount);
    } catch (error) {
      this.logger.error('Error checking donor count:', error);
    }
  }

  /**
   * Seeds the donors into the repository.
   * @param existingCount - The current number of donors in the repository.
   */
  private async seedDonors(existingCount: number): Promise<void> {
    const donorsToCreate = this.TOTAL_DONORS - existingCount;
    this.logger.log(`Seeding ${donorsToCreate} donors...`);

    const initialDonors: Partial<Donor>[] = [];

    for (let i = 0; i < donorsToCreate; i++) {
      const donor = this.generateRandomDonor();
      initialDonors.push(donor);
    }

    try {
      await this.insertDonorsInBatches(initialDonors);
      this.logger.log(`Successfully seeded ${initialDonors.length} donors.`);
    } catch (error) {
      this.logger.error('Error seeding donors:', error);
    }
  }

  /**
   * Generates a single random donor.
   * @returns A partially filled Donor object.
   */
  private generateRandomDonor(): Partial<Donor> {
    // Select a random city
    const cityKey = faker.helpers.arrayElement(Object.keys(BC_CITIES));
    const city = BC_CITIES[cityKey];

    // Randomize coordinates based on the city center
    const { lat, lng } = randomizeCoordinates(
      city.lat,
      city.lng,
      this.MAX_DISTANCE_KM,
    );

    // Select random interests
    const numberOfInterests = randomInt(1, 8); // At least 1 interest
    const donorInterests = faker.helpers
      .shuffle(INTERESTS)
      .slice(0, numberOfInterests);

    return {
      pmm: faker.person.fullName(),
      smm: faker.person.fullName(),
      vmm: faker.person.fullName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nickName: faker.helpers.arrayElement([faker.person.firstName(), null]),
      exclude: faker.datatype.boolean(),
      deceased: faker.datatype.boolean(),
      organizationName: faker.datatype.boolean() ? faker.company.name() : null,
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.datatype.boolean()
        ? faker.location.secondaryAddress()
        : null,
      city: city.name,
      lat: parseFloat(lat.toFixed(6)), // Limiting to 6 decimal places
      lng: parseFloat(lng.toFixed(6)),
      interests: donorInterests,
      contactPhoneType: faker.helpers.arrayElement(['Mobile', 'Home', 'Work']),
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
      lastGiftAppeal: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    };
  }

  /**
   * Inserts donors into the repository in batches.
   * @param donors - Array of donors to insert.
   */
  private async insertDonorsInBatches(donors: Partial<Donor>[]): Promise<void> {
    const totalBatches = Math.ceil(donors.length / this.BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * this.BATCH_SIZE;
      const end = start + this.BATCH_SIZE;
      const batch = donors.slice(start, end);

      try {
        await this.donorRepository.save(batch);
        this.logger.log(
          `Inserted batch ${batchIndex + 1} of ${totalBatches} (${batch.length} donors).`,
        );
      } catch (error) {
        this.logger.error(
          `Error inserting batch ${batchIndex + 1}:`,
          error instanceof Error ? error.message : error,
        );
        throw error; // Rethrow to handle in the calling method
      }
    }
  }
}
