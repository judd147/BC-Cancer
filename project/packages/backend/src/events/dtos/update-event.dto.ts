import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateEventDto {
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
