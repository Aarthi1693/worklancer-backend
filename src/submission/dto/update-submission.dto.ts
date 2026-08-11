import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsString()
  deploymentLink?: string;

  @IsOptional()
  @IsString()
  reportFile?: string;

  @IsOptional()
  @IsString()
  imageUrls?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}