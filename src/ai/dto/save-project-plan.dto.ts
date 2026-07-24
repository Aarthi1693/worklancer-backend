import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';

export class SaveProjectPlanDto {
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
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @IsOptional()
  @IsString()
  teamSize?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsObject()
  planData: Record<string, unknown>;

  @IsOptional()
  @IsString()
  projectId?: string;
}
