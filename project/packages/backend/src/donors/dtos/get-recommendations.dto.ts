import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class GetRecommendationsDto {
  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  minTotalDonations?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intendedAttendees?: string[];
}
