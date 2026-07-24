require('reflect-metadata');
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');

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
  const plain = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'testpass123',
    role: 'PROVIDER',
  };

  const instance = plainToInstance(RegisterDto, plain);
  console.log('Instance:', instance);
  console.log('Instance keys:', Object.keys(instance));
  console.log('Instance.password:', instance.password);

  const errors = await validate(instance);
  console.log('Validation errors:', errors.length === 0 ? 'None' : errors);
}

test().catch(console.error);
