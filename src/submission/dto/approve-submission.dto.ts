import { IsString, IsOptional } from 'class-validator';

export class ApproveSubmissionDto {
  @IsOptional()
  @IsString()
  feedback?: string;
}
