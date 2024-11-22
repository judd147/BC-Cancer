import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, MoreThanOrEqual, Like } from 'typeorm';
import { Donor } from './donor.entity';
import { GetDonorsDto } from './dtos/get-donors.dto';
import { SeederService } from '../seeder/seeder.service';
import { GetRecommendationsDto } from './dtos/get-recommendations.dto';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor) private repo: Repository<Donor>,
    private readonly seederService: SeederService,
  ) {}

  async find(getDonorsDto: GetDonorsDto) {
    await this.seederService.seedDonorsIfNeeded();

    const {
      firstName,
      lastName,
      exclude,
      deceased,
      city,
      interests,
      minTotalDonations,
      maxTotalDonations,
      firstGiftDateFrom,
      firstGiftDateTo,
      page = 1,
      limit = 10,
      orderBy = 'id',
      orderDirection = 'ASC',
    } = getDonorsDto;

    const query = this.repo.createQueryBuilder('donor');

    if (firstName) {
      query.andWhere('donor.firstName LIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      query.andWhere('donor.lastName LIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }

    if (exclude !== undefined) {
      query.andWhere('donor.exclude = :exclude', { exclude });
    }

    if (deceased !== undefined) {
      query.andWhere('donor.deceased = :deceased', { deceased });
    }

    if (city !== undefined) {
      query.andWhere('donor.city LIKE :city', { city: `%${city}%` });
    }

    if (interests && interests.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          interests.forEach((interest) => {
            qb.orWhere('donor.interests LIKE :interest', {
              interest: `%${interest}%`,
            });
          });
        }),
      );
    }

    if (minTotalDonations !== undefined) {
      query.andWhere('donor.totalDonations >= :minTotalDonations', {
        minTotalDonations,
      });
    }

    if (maxTotalDonations !== undefined) {
      query.andWhere('donor.totalDonations <= :maxTotalDonations', {
        maxTotalDonations,
      });
    }

    if (firstGiftDateFrom) {
      query.andWhere('donor.firstGiftDate >= :firstGiftDateFrom', {
        firstGiftDateFrom,
      });
    }

    if (firstGiftDateTo) {
      query.andWhere('donor.firstGiftDate <= :firstGiftDateTo', {
        firstGiftDateTo,
      });
    }

    query.orderBy(`donor.${orderBy}`, orderDirection).skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async deleteAllAndSeedNew() {
    await this.repo.clear();
    await this.seederService.seedDonorsIfNeeded();
  }

  async findRecommendations(query: GetRecommendationsDto) {
    const {
      eventType,
      location,
      minTotalDonations,
      targetAttendees = 100,
    } = query;
  
    if (!eventType || eventType.length === 0) {
      throw new Error('eventType must be a non-empty array.');
    }
  
    const primaryType = eventType[0];
    const queryBuilder = this.repo.createQueryBuilder('donor');
  
    queryBuilder.where(
      new Brackets((qb) => {
        eventType.forEach((type, index) => {
          const clause = 'donor.interests LIKE :type' + index;
          if (index === 0) {
            qb.where(clause, { [`type${index}`]: `%${type}%` });
          } else {
            qb.orWhere(clause, { [`type${index}`]: `%${type}%` });
          }
        });
      }),
    );
  
    if (location) {
      queryBuilder.andWhere('donor.city LIKE :location', {
        location: `%${location}%`,
      });
    }
  
    if (minTotalDonations !== undefined) {
      queryBuilder.andWhere('donor.totalDonations >= :minTotalDonations', {
        minTotalDonations,
      });
    }
  
    queryBuilder
      .orderBy(
        `CASE WHEN donor.interests LIKE :primaryType THEN 1 ELSE 2 END`,
        'ASC',
      )
      .addOrderBy('donor.totalDonations', 'DESC')
      .setParameter('primaryType', `%${primaryType}%`)
      .take(targetAttendees);
  
    return queryBuilder.getMany();
  }  
}
