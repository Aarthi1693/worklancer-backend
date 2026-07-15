import { SubmissionStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateSubmissionDto {
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;
}
