import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskType } from '@prisma/client';

function normalizeTaskType(value: string | undefined): TaskType | undefined {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, '_');

  if (normalized === 'DIGITAL' || normalized === 'DIGITAL_TASK') {
    return TaskType.DIGITAL;
  }

  if (
    normalized === 'FIELD' ||
    normalized === 'ON_FIELD' ||
    normalized === 'ONFIELD' ||
    normalized === 'ON_FIELD_TASK'
  ) {
    return TaskType.FIELD;
  }

  return undefined;
}

export class CreateProjectDto {
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @Type(() => Number)
  @IsNumber()
  budget!: number;

  @IsString()
  requiredSkills!: string;

  @Transform(({ value }) => normalizeTaskType(value as string | undefined))
  @IsEnum(TaskType)
  taskType!: TaskType;
}
