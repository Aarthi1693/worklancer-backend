import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskType } from '@prisma/client';

export class CreateProjectDto {
  @IsUUID()
  providerId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  budget: number;

  @IsString()
  requiredSkills: string;

  @IsEnum(TaskType)
  taskType: TaskType;
}
