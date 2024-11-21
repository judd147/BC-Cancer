import { UpdateEventDto as UpdateEvent } from '@bc-cancer/shared/src/types';
import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

export class UpdateEventDto implements UpdateEvent {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  admins?: number[];

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
