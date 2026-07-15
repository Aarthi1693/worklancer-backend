import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  applicationId: string;

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
  @IsDateString()
  completionDate?: string;

  @IsString()
  description: string;
}
