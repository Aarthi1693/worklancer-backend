import { IsString } from 'class-validator';

export class RejectSubmissionDto {
  @IsString()
  feedback: string;

  @IsString()
  reason: string;
}
