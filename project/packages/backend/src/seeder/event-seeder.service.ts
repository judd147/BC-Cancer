import { faker } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from 'src/events/dtos/create-event.dto';
import { Event } from 'src/events/event.entity';
import { EventService } from 'src/events/events.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { INTERESTS } from './donor-seeder.service';

// Define the base date range for all events
const baseDateRange = {
  from: new Date(2024, 0, 1),
  to: new Date(2024, 11, 31),
};

// Helper function to generate donor IDs
const generateDonorIds = () =>
  faker.helpers.multiple(() => faker.number.int({ min: 1, max: 500 }), {
    count: { min: 50, max: 99 },
  });

// Helper function to generate admin IDs
const generateAdminIds = () =>
  faker.helpers.multiple(() => faker.number.int({ min: 1, max: 100 }), {
    count: { min: 3, max: 5 },
  });

// Helper function to generate a random date within the base range
const generateDate = () => faker.date.between(baseDateRange).toISOString();

// Function to create a fake event
const createFakeEvent = ({
  name,
  coverImage,
  addressLine1,
  addressLine2,
  city,
  description,
  hasTags = false,
  comment,
}: {
  name: string;
  coverImage?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  description?: string;
  hasTags?: boolean;
  comment?: string;
}): CreateEventDto => ({
  name,
  ...(coverImage && { coverImage }),
  addressLine1,
  ...(addressLine2 && { addressLine2 }),
  city,
  date: generateDate(),
  ...(description && { description }),
  ...(hasTags && {
    tags: faker.helpers.arrayElements(INTERESTS, { min: 1, max: 4 }),
  }),
  donorIds: generateDonorIds(),
  admins: generateAdminIds(),
  ...(comment && { comment }),
});

// Array of event-specific data
const eventDefinitions = [
  {
    name: 'Hope Gala 2024',
    coverImage: '/img/coverImage1.jpg',
    addressLine1: '123 Maple Street',
    city: 'Vancouver',
    description: 'An evening of hope and fundraising for BC Cancer.',
    hasTags: true,
    comment: 'Annual event with keynote speakers and live music.',
  },
  {
    name: 'Run for Life',
    addressLine1: '456 Oak Avenue',
    city: 'Surrey',
  },
  {
    name: 'Cancer Awareness Workshop',
    coverImage: '/img/coverImage2.jpg',
    addressLine1: '789 Pine Road',
    addressLine2: 'Suite 101',
    city: 'Richmond',
    description: 'Educational workshop on cancer prevention and awareness.',
    hasTags: true,
    comment: 'Free entry with registration.',
  },
  {
    name: 'Charity Auction',
    addressLine1: '321 Birch Boulevard',
    city: 'Burnaby',
  },
  {
    name: 'Art for Cancer',
    coverImage: '/img/coverImage3.jpg',
    addressLine1: '654 Cedar Lane',
    city: 'Coquitlam',
    description: 'Art exhibition to raise funds for cancer research.',
    hasTags: true,
    comment: 'Featuring local artists.',
  },
  {
    name: 'Bike Marathon',
    coverImage: '/img/coverImage4.jpg',
    addressLine1: '987 Spruce Street',
    city: 'Langley',
  },
  {
    name: 'Charity Concert',
    coverImage: '/img/coverImage5.jpg',
    addressLine1: '159 Walnut Avenue',
    city: 'Abbotsford',
    description: 'Live performances to support BC Cancer initiatives.',
    hasTags: true,
    comment: 'All proceeds go to cancer research.',
  },
  {
    name: 'Community Picnic',
    addressLine1: '753 Chestnut Drive',
    city: 'Surrey',
  },
  {
    name: 'Yoga for Wellness',
    addressLine1: '852 Willow Way',
    city: 'Vancouver',
    description: 'Yoga sessions promoting mental and physical health.',
    hasTags: true,
    comment: 'Beginner-friendly classes.',
  },
  {
    name: 'Bake Sale Bonanza',
    addressLine1: '147 Poplar Street',
    city: 'Richmond',
  },
  {
    name: 'Charity Golf Tournament',
    addressLine1: '369 Elm Avenue',
    city: 'Burnaby',
    description:
      'Golf tournament to raise funds for cancer treatment programs.',
    hasTags: true,
    comment: 'Includes prizes and networking opportunities.',
  },
  {
    name: 'Dance Marathon',
    addressLine1: '258 Maple Road',
    city: 'Coquitlam',
  },
  {
    name: 'Charity Dinner',
    addressLine1: '654 Oak Boulevard',
    city: 'Langley',
    description: 'Formal dinner event supporting BC Cancer research.',
    hasTags: true,
    comment: 'Includes silent auction.',
  },
  {
    name: 'Health Fair',
    coverImage: '/img/coverImage6.jpg',
    addressLine1: '321 Pine Street',
    city: 'Abbotsford',
  },
  {
    name: 'Charity Auction Online',
    coverImage: '/img/coverImage7.jpg',
    addressLine1: '789 Cedar Avenue',
    city: 'Surrey',
    description: 'Online auction to support cancer care programs.',
    hasTags: true,
    comment: 'Bidding starts at $10.',
  },
  {
    name: 'Charity Movie Night',
    addressLine1: '456 Willow Lane',
    city: 'Vancouver',
  },
  {
    name: 'Spring Charity Festival',
    addressLine1: '159 Spruce Road',
    city: 'Richmond',
    description: 'Festival with games, food, and entertainment to raise funds.',
    hasTags: true,
    comment: 'Family-friendly event.',
  },
  {
    name: 'Charity Concert Series',
    coverImage: '/img/coverImage8.jpg',
    addressLine1: '753 Chestnut Avenue',
    city: 'Burnaby',
  },
  {
    name: 'Charity Sports Day',
    coverImage: '/img/coverImage9.jpg',
    addressLine1: '852 Walnut Street',
    city: 'Coquitlam',
    description: 'Sports activities and competitions to support BC Cancer.',
    hasTags: true,
    comment: 'Teams of all ages welcome.',
  },
  {
    name: 'Charity Art Auction',
    addressLine1: '369 Poplar Drive',
    city: 'Langley',
  },
];

// Generate the fakeEvents array by mapping over eventDefinitions
const fakeEvents: CreateEventDto[] = eventDefinitions.map(createFakeEvent);

@Injectable()
export class EventSeederService implements OnModuleInit {
  private readonly logger = new Logger(EventSeederService.name);
  private readonly TOTAL_EVENTS = 20;
  private readonly TOTAL_USERS = 100;

  constructor(
    private readonly eventService: EventService,
    private readonly authService: AuthService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      await this.seedUsers();
      await this.seedEvents();
    } catch (error) {
      this.logger.error(`Failed to seed events: ${error}`);
    }
  }

  async seedUsers() {
    const existingUserCount = await this.userRepository.count();
    if (existingUserCount >= this.TOTAL_USERS) {
      this.logger.log(
        `Users already seeded with ${existingUserCount} entries. Skipping seeding.`,
      );
      return;
    }

    const usersToCreate = this.TOTAL_USERS - existingUserCount;
    const userPromises = Array.from({ length: usersToCreate }, () =>
      this.authService.signup(faker.internet.username(), 'password'),
    );
    userPromises.push(this.authService.signup('demouser', 'password'));
    await Promise.all(userPromises);

    this.logger.log(`Seeded ${usersToCreate} users.`);
  }

  async seedEvents() {
    const existingEventCount = await this.eventRepository.count();
    if (existingEventCount >= this.TOTAL_EVENTS) {
      this.logger.log(
        `Events already seeded with ${existingEventCount} entries. Skipping event seeding.`,
      );
      return;
    }

    const eventsToCreate = this.TOTAL_EVENTS - existingEventCount;
    const users = await this.userRepository.find();

    const eventPromises = Array.from({ length: eventsToCreate }, (_, index) => {
      const eventData = fakeEvents[index % fakeEvents.length];
      const creator = faker.helpers.arrayElement(users);
      return this.eventService.createEvent(eventData, creator);
    });

    await Promise.all(eventPromises);
    this.logger.log(`Seeded ${eventsToCreate} events.`);

    // Seed change history for the first newly created event
    const firstNewEventId = existingEventCount + 1;
    await this.seedChangeHistory(firstNewEventId);
  }

  async seedChangeHistory(eventId: number) {
    try {
      const event = await this.eventService.getEvent(eventId);
      const donors = await this.eventService.getEventDonors(eventId);
      const creator = event.createdBy as User;
      const admins = event.admins as User[];

      await this.eventService.updateEvent(
        eventId,
        {
          name: 'Hope Gala Vancouver 2024',
          description:
            'An evening of hope and fundraising for BC Cancer, featuring keynote speakers and live music.',
          comment: 'Updated event name and description.',
        },
        creator,
      );

      await this.eventService.updateEvent(
        eventId,
        {
          addressLine1: '124 Maple Street',
          addressLine2: 'Suite 201',
          city: 'Vancouver',
        },
        faker.helpers.arrayElement(admins),
      );

      const donorIds = donors.preview.map((donor) => donor.id);
      const invitedDonorIds = faker.helpers.arrayElements(donorIds, 10);
      const excludedDonorIds = faker.helpers.arrayElements(donorIds, 7);

      await Promise.all([
        this.eventService.updateDonorsStatus(
          eventId,
          {
            donorIds: invitedDonorIds,
            newStatus: 'invited',
            comment: 'Donors confirmed attendance.',
          },
          faker.helpers.arrayElement(admins),
        ),
        this.eventService.updateDonorsStatus(
          eventId,
          {
            donorIds: excludedDonorIds,
            newStatus: 'excluded',
            comment: 'Donors unable to attend.',
          },
          faker.helpers.arrayElement(admins),
        ),
      ]);

      this.logger.log(`Seeded change history for event ${eventId}.`);
    } catch (error) {
      this.logger.error(
        `Failed to seed change history for event ${eventId}.`,
        error,
      );
    }
  }
}
