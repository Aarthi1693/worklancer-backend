export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: 'ADMIN' | 'PROVIDER' | 'MASTER';

  skills?: string;
  experience?: number;
}
