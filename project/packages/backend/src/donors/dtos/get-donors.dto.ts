import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GetDonorsParams } from '@bc-cancer/shared/src/types';

export class GetDonorsDto implements GetDonorsParams {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  exclude?: boolean;

  @IsOptional()
  @IsBoolean()
  deceased?: boolean;

  @IsOptional()
  @IsNumber()
  minTotalDonations?: number;

  @IsOptional()
  @IsNumber()
  maxTotalDonations?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  firstGiftDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  firstGiftDateTo?: Date;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';
}
