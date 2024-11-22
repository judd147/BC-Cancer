import { IsOptional, IsString, IsNumber, IsArray, IsInt, Min } from 'class-validator';

export class GetRecommendationsDto {
  @IsArray()
  @IsString({ each: true })
  eventType: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber({}, { message: 'minTotalDonations must be a number' })
  @Min(0, { message: 'minTotalDonations must be at least 0' })
  minTotalDonations?: number;

  @IsOptional()
  @IsInt({ message: 'targetAttendees must be a whole number' })
  @Min(1, { message: 'targetAttendees must be at least 1' })
  targetAttendees?: number;
}
