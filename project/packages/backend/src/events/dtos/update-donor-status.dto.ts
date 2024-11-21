import {
  IsArray,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  IsNumber,
} from 'class-validator';
import {
  DonorStatus,
  UpdateDonorsStatusDto as IUpdateDonorsStatusDto,
} from '@bc-cancer/shared/src/types';

export class UpdateDonorsStatusDto implements IUpdateDonorsStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  donorIds: number[];

  @IsString()
  newStatus: DonorStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
