import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';

export class UpdateProjectPlanDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
