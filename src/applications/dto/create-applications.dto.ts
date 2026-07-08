import { IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  projectId: string;
}
