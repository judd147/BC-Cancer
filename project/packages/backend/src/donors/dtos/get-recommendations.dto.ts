import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class GetRecommendationsDto {
  @ApiProperty({
    description: 'Array of event types to filter donors by.',
    example: ['Lung Cancer', 'Kidney Cancer'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  eventType: string[];

  @ApiPropertyOptional({
    description: 'Minimum total donations a donor must have made.',
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  minTotalDonations?: number;

  @ApiPropertyOptional({
    description: 'Number of donors to recommend.',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  targetAttendees?: number;

  @ApiPropertyOptional({
    description: 'City location to filter donors by.',
    example: 'Vancouver',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Focus of recommendations: "fundraising" or "attendees".',
    enum: ['fundraising', 'attendees'],
    example: 'fundraising',
  })
  @IsOptional()
  @IsString()
  eventFocus?: 'fundraising' | 'attendees';
}
