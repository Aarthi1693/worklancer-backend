const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

class CreateUserDto {
  name = 'Test User';
  email = 'test-' + Date.now() + '@test.com';
  password = 'testpass123';
  role = 'PROVIDER';
  skills = undefined;
  experience = undefined;
}

async function test() {
  const prisma = new PrismaClient();
  const data = new CreateUserDto();

  console.log('1. Hashing password...');
  const hashedPassword = await bcrypt.hash(data.password, 10);
  console.log('   Hash:', hashedPassword.substring(0, 30) + '...');

  console.log('2. Creating user with spread...');
  const createData = {
    ...data,
    password: hashedPassword,
  };
  console.log('   createData keys:', Object.keys(createData));
  console.log('   createData.password:', createData.password.substring(0, 30) + '...');

  const user = await prisma.user.create({
    data: createData,
  });
  console.log('   Created user:', user.id);
  console.log(
    '   Password saved:',
    user.password ? 'YES (' + user.password.substring(0, 30) + '...)' : 'NO (NULL!)',
  );

  console.log('3. Finding user...');
  const found = await prisma.user.findUnique({ where: { email: data.email } });
  console.log('   Found:', found ? 'YES' : 'NO');
  if (found) {
    console.log(
      '   Password value:',
      found.password ? found.password.substring(0, 30) + '...' : 'NULL/UNDEFINED',
    );
    console.log('   kycStatus:', found.kycStatus);

    console.log('4. Comparing password...');
    const match = await bcrypt.compare(data.password, found.password);
    console.log('   Match:', match);
  }

  // Cleanup
  await prisma.user.delete({ where: { email: data.email } });
  console.log('5. Cleaned up test user');

  await prisma.$disconnect();
}

test().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
