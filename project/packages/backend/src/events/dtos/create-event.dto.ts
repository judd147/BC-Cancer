import { IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;
}
