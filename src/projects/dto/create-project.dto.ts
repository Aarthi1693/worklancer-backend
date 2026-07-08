import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  budget: number;

  @IsString()
  requiredSkills: string;
}
