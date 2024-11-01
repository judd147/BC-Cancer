import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Donor } from '../donors/donor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  providers: [SeederService],
})
export class SeederModule {}
