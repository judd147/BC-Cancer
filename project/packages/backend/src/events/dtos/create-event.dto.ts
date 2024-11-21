import { CreateEventDto as CreateEvent } from '@bc-cancer/shared/src/types';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsNotEmpty,
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

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @ArrayUnique()
  @IsNotEmpty()
  donorIds: number[];

  @IsOptional()
  @ArrayUnique()
  @IsArray()
  admins?: number[];

  @IsOptional()
  @IsString()
  comment?: string;
}
