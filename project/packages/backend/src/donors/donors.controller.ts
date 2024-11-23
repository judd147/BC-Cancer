import { BadRequestException, Controller, Get, InternalServerErrorException, Post, Query, UseGuards } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { GetDonorsDto } from './dtos/get-donors.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetRecommendationsDto } from './dtos/get-recommendations.dto';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get('/recommendations')
  async recommendDonors(@Query() query: any) {
    let { eventType, minTotalDonations, targetAttendees, location, eventFocus } = query;

    if (eventType && !Array.isArray(eventType)) {
      eventType = [eventType];
    }

    minTotalDonations = minTotalDonations !== undefined ? Number(minTotalDonations) : undefined;
    targetAttendees = targetAttendees !== undefined ? Number(targetAttendees) : undefined;

    if (!eventType || !Array.isArray(eventType) || eventType.length === 0) {
      throw new BadRequestException('eventType must be a non-empty array.');
    }

    if (minTotalDonations !== undefined && (isNaN(minTotalDonations) || minTotalDonations < 0)) {
      throw new BadRequestException('minTotalDonations must be a non-negative number.');
    }

    if (targetAttendees !== undefined && (!Number.isInteger(targetAttendees) || targetAttendees < 1)) {
      throw new BadRequestException('targetAttendees must be a positive integer.');
    }

    if (location && typeof location !== 'string') {
      throw new BadRequestException('location must be a string.');
    }

    if (eventFocus && !['fundraising', 'attendees'].includes(eventFocus)) {
      throw new BadRequestException('eventFocus must be either "fundraising" or "attendees".');
    }

    try {
      return await this.donorsService.findRecommendations({
        eventType,
        minTotalDonations,
        targetAttendees,
        location,
        eventFocus,
      });
    } catch (error) {
      console.error('Error in recommendDonors:', error.message);
      throw new InternalServerErrorException('An error occurred while processing recommendations.');
    }
  }

  @Post('reset')
  async resetDonors() {
    await this.donorsService.deleteAllAndSeedNew();
    return { message: 'All donors deleted and new donors seeded' };
  }
}

