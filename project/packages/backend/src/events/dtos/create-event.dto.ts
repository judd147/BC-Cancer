import { CreateEventDto as CreateEvent } from '@bc-cancer/shared/src/types';
import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto implements CreateEvent {
  @IsString()
  name: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  donorsList?: string;
}
