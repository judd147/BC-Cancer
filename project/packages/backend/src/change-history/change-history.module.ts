import { Module } from '@nestjs/common';
import { ChangeHistoryController } from './change-history.controller';
import { ChangeHistoryService } from './change-history.service';
import { EventChangeHistory } from './event-change-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EventChangeHistory])],
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService],
  exports: [ChangeHistoryService],
})
export class ChangeHistoryModule {}
