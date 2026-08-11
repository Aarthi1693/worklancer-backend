import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateProjectPlanDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamSize?: number;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
