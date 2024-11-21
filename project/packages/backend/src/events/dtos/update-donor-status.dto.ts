import {
  IsArray,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  IsNumber,
  IsIn,
} from 'class-validator';
import {
  DonorStatus,
  UpdateDonorsStatusDto as IUpdateDonorsStatusDto,
} from '@bc-cancer/shared/src/types';
import { donorStatuses } from '../events.service';

export class UpdateDonorsStatusDto implements IUpdateDonorsStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  donorIds: number[];

  @IsString()
  @IsIn(Object.values(donorStatuses))
  newStatus: DonorStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
