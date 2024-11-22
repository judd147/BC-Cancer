import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRecommendationsDto {
  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber({}, { message: 'minTotalDonations must be a number conforming to the specified constraints' })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  minTotalDonations?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intendedAttendees?: string[];
}
