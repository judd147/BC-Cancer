import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
  recommendDonors(@Query() query: GetRecommendationsDto) {
    return this.donorsService.findRecommendations(query);
  }

  @Post('reset')
  async resetDonors() {
    await this.donorsService.deleteAllAndSeedNew();
    return { message: 'All donors deleted and new donors seeded' };
  }
}
