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
  Abbotsford: { name: 'Abbotsford', lat: 49.0509, lng: -122.3045 },
  Armstrong: { name: 'Armstrong', lat: 50.0037, lng: -119.5563 },
  Burnaby: { name: 'Burnaby', lat: 49.2488, lng: -122.9805 },
  'Campbell River': {
    name: 'Campbell River',
    lat: 50.0163,
    lng: -125.2446,
  },
  Castlegar: { name: 'Castlegar', lat: 49.3255, lng: -117.6661 },
  Chilliwack: { name: 'Chilliwack', lat: 49.1747, lng: -121.9443 },
  Colwood: { name: 'Colwood', lat: 48.4333, lng: -123.4833 },
  Coquitlam: { name: 'Coquitlam', lat: 49.2838, lng: -122.7932 },
  Courtenay: { name: 'Courtenay', lat: 49.6866, lng: -124.9933 },
  Cranbrook: { name: 'Cranbrook', lat: 49.5137, lng: -115.7688 },
  'Dawson Creek': {
    name: 'Dawson Creek',
    lat: 55.7667,
    lng: -120.2333,
  },
  Delta: { name: 'Delta', lat: 49.14399, lng: -123.96175 },
  Duncan: { name: 'Duncan', lat: 48.7768, lng: -123.7074 },
  Enderby: { name: 'Enderby', lat: 50.5501, lng: -119.1384 },
  Fernie: { name: 'Fernie', lat: 49.5042, lng: -115.0633 },
  'Fort St. John': {
    name: 'Fort St. John',
    lat: 56.24999,
    lng: -120.84991,
  },
  'Grand Forks': { name: 'Grand Forks', lat: 49.0333, lng: -118.4333 },
  Greenwood: { name: 'Greenwood', lat: 49.1, lng: -118.6833 },
  Kamloops: { name: 'Kamloops', lat: 50.6745, lng: -120.3271 },
  Kelowna: { name: 'Kelowna', lat: 49.888, lng: -119.496 },
  Kimberley: { name: 'Kimberley', lat: 49.4521, lng: -115.7854 },
  Langford: { name: 'Langford', lat: 48.4274, lng: -123.3653 },
  Langley: { name: 'Langley', lat: 49.1045, lng: -122.6603 },
  'Maple Ridge': { name: 'Maple Ridge', lat: 49.2183, lng: -122.6055 },
  Merritt: { name: 'Merritt', lat: 50.1719, lng: -120.8173 },
  Mission: { name: 'Mission', lat: 49.1128, lng: -122.3036 },
  Nanaimo: { name: 'Nanaimo', lat: 49.1659, lng: -123.9401 },
  Nelson: { name: 'Nelson', lat: 49.4934, lng: -117.2948 },
  'New Westminster': {
    name: 'New Westminster',
    lat: 49.2053,
    lng: -122.9088,
  },
  'North Vancouver': {
    name: 'North Vancouver',
    lat: 49.3204,
    lng: -123.0695,
  },
  Parksville: { name: 'Parksville', lat: 49.2953, lng: -124.2911 },
  Penticton: { name: 'Penticton', lat: 49.4934, lng: -119.6304 },
  'Pitt Meadows': { name: 'Pitt Meadows', lat: 49.2275, lng: -122.801 },
  'Port Alberni': { name: 'Port Alberni', lat: 49.25, lng: -124.8 },
  'Port Coquitlam': {
    name: 'Port Coquitlam',
    lat: 49.2836,
    lng: -122.7845,
  },
  'Port Moody': { name: 'Port Moody', lat: 49.2833, lng: -122.7847 },
  'Powell River': { name: 'Powell River', lat: 49.8773, lng: -124.5022 },
  'Prince George': {
    name: 'Prince George',
    lat: 53.917,
    lng: -122.7497,
  },
  'Prince Rupert': {
    name: 'Prince Rupert',
    lat: 54.3194,
    lng: -130.3333,
  },
  Quesnel: { name: 'Quesnel', lat: 52.9703, lng: -122.4954 },
  Revelstoke: { name: 'Revelstoke', lat: 50.9817, lng: -118.1923 },
  Richmond: { name: 'Richmond', lat: 49.1667, lng: -123.1333 },
  Rossland: { name: 'Rossland', lat: 49.123, lng: -117.6483 },
  'Salmon Arm': { name: 'Salmon Arm', lat: 50.6853, lng: -119.2777 },
  Surrey: { name: 'Surrey', lat: 49.1951, lng: -122.849 },
  Terrace: { name: 'Terrace', lat: 54.5167, lng: -128.5833 },
  Trail: { name: 'Trail', lat: 49.0, lng: -117.5667 },
  Vancouver: { name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
  Vernon: { name: 'Vernon', lat: 50.2407, lng: -119.2727 },
  Victoria: { name: 'Victoria', lat: 48.4284, lng: -123.3656 },
  'West Kelowna': {
    name: 'West Kelowna',
    lat: 49.8784,
    lng: -119.6061,
  },
  'White Rock': { name: 'White Rock', lat: 49.0258, lng: -122.8036 },
  'Williams Lake': {
    name: 'Williams Lake',
    lat: 52.1464,
    lng: -122.0967,
  },
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
