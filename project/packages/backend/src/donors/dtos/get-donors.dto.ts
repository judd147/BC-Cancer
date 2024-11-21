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
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';
}
