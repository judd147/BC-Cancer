import { UpdateEventDto as UpdateEvent } from '@bc-cancer/shared/src/types';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateEventDto implements UpdateEvent {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsDateString()
  @IsOptional()
  date: string;
}
