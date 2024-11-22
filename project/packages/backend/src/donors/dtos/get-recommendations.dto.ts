import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecommendationsDto {
  @IsString()
  eventType: string;

  @Type(() => Number)
  @IsNumber()
  minTotalDonations: number;
}
