export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: 'PROVIDER' | 'MASTER';

  skills?: string;
  experience?: number;
}
