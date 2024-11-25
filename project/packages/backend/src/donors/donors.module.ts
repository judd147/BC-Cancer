import { Module } from '@nestjs/common';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { Donor } from './donor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorSeederService } from '../seeder/donor-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorsController],
  providers: [DonorsService, DonorSeederService],
})
export class DonorsModule {}
