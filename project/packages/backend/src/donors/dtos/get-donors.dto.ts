import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Donor, GetDonorsParams } from '@bc-cancer/shared/src/types';

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
  @IsString()
  city?: string;

  @IsOptional()
  @IsString({ each: true })
  interests?: string[];

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
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  orderBy?: keyof Donor | 'distance';

  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';

  // New fields for proximity search
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number; // Distance in kilometers
}
