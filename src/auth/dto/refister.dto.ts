export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  role!: 'ADMIN' | 'PROVIDER' | 'MASTER';

  skills?: string;
  experience?: number;
}
