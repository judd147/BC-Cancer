import { BadRequestException, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { GetDonorsDto } from './dtos/get-donors.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetRecommendationsDto } from './dtos/get-recommendations.dto';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getDonors(@Query() getDonorsDto: GetDonorsDto) {
    return this.donorsService.find(getDonorsDto);
  }

  @Get('/recommendations')
  recommendDonors(@Query() query: any) {
    let { eventType, minTotalDonations, targetAttendees, location } = query;

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

    return this.donorsService.findRecommendations({
      eventType,
      minTotalDonations,
      targetAttendees,
      location,
    });
  }

  @Post('reset')
  async resetDonors() {
    await this.donorsService.deleteAllAndSeedNew();
    return { message: 'All donors deleted and new donors seeded' };
  }
}
