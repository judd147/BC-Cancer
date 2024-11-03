import { CreateEventDto as CreateEvent } from '@bc-cancer/shared/src/types';
import { IsString, IsDateString } from 'class-validator';

export class CreateEventDto implements CreateEvent {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;
}
