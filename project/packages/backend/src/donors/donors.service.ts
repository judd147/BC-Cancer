import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async findRecommendations(query: GetRecommendationsDto, weights?: { [key: string]: number }) {
    try {
        const {
            eventType,
            location,
            minTotalDonations = 0,
            targetAttendees = 100,
            eventFocus = 'fundraising',
        } = query;

        if (!eventType || eventType.length === 0) {
            throw new Error('eventType must be a non-empty array.');
        }

        const primaryType = eventType[0];
        const queryBuilder = this.repo.createQueryBuilder('donor');

        queryBuilder.where(
            new Brackets((qb) => {
                eventType.forEach((type, index) => {
                    const paramName = `type${index}`;
                    const clause = `donor.interests LIKE :${paramName}`;
                    if (index === 0) {
                        qb.where(clause, { [paramName]: `%${type}%` });
                    } else {
                        qb.orWhere(clause, { [paramName]: `%${type}%` });
                    }
                });
            }),
        );

        if (location) {
            queryBuilder.andWhere('donor.city LIKE :location', {
                location: `%${location}%`,
            });
        }

        queryBuilder.andWhere('COALESCE(donor.totalDonations, 0) >= :minTotalDonations', {
            minTotalDonations,
        });

        const defaultWeights = {
            interestMatch: 10,
            locationMatch: 5,
            totalDonations: eventFocus === 'fundraising' ? 1 / 10000 : 1 / 20000,
            largestGift: eventFocus === 'fundraising' ? 1 / 5000 : 1 / 10000,
            recentGiftBonus: eventFocus === 'attendees' ? 10 : 5,
            inPersonEvent: 3,
            magazineSubscription: 2,
        };

        const finalWeights = { ...defaultWeights, ...(weights || {}) };

        queryBuilder.addSelect(
            `
            (
                ${finalWeights.interestMatch} * (CASE WHEN donor.interests LIKE :primaryType THEN 1 ELSE 0 END) +
                ${finalWeights.locationMatch} * (CASE WHEN donor.city LIKE :location THEN 1 ELSE 0 END) +
                COALESCE(donor.totalDonations, 0) * ${finalWeights.totalDonations} +
                COALESCE(donor.largestGift, 0) * ${finalWeights.largestGift} +
                ${finalWeights.recentGiftBonus} * (CASE WHEN donor.lastGiftDate >= :recentThreshold THEN 1 ELSE 0 END) +
                COALESCE(donor.subscriptionEventsInPerson, 0) * ${finalWeights.inPersonEvent} +
                COALESCE(donor.subscriptionEventsMagazine, 0) * ${finalWeights.magazineSubscription}
            )`,
            'score',
        );

        queryBuilder.setParameters({
            primaryType: `%${primaryType}%`,
            location: `%${location || ''}%`,
            recentThreshold: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1-year threshold
        });

        queryBuilder
            .orderBy('score', 'DESC') // Primary sort by score
            .addOrderBy(
                eventFocus === 'fundraising' ? 'donor.totalDonations' : 'donor.lastGiftDate',
                'DESC',
            )
            .addOrderBy('donor.lastGiftDate', 'DESC') // Tie-breaker
            .take(targetAttendees);

        const recommendations = await queryBuilder.getMany();
        return recommendations;
    } catch (error) {
        console.error('Error in findRecommendations:', error.message, query, weights);
        throw new InternalServerErrorException('An error occurred while processing recommendations.');
    }
  }
}
