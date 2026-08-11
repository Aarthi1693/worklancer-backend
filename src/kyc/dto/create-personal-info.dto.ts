import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  dob: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @Matches(/^[0-9]{10}$/)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @Matches(/^[0-9]{6}$/)
  pincode: string;
}
