require('reflect-metadata');
const { IsEnum, validate } = require('class-validator');

const UserRole = {
  ADMIN: 'ADMIN',
  PROVIDER: 'PROVIDER',
  MASTER: 'MASTER',
};

class RegisterDto {
  name = 'Test';
  email = 'test@test.com';
  password = 'testpass123';
  role = 'PROVIDER';
  skills = undefined;
  experience = undefined;
}

async function test() {
  const dto = new RegisterDto();

  const errors = await validate(dto);
  console.log('Validation errors:', errors.length === 0 ? 'None' : errors);
}

test().catch(console.error);
