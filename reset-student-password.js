const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetStudentPassword() {
  try {
    console.log('Resetting student password...');
    
    const password = 'student@123!';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('Password:', password);
    console.log('New hash:', hashedPassword);
    
    const result = await prisma.user.update({
      where: { email: 'student@skillnexus.com' },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully for:', result.email);
    
    // Verify the update
    const user = await prisma.user.findUnique({
      where: { email: 'student@skillnexus.com' },
      select: { email: true, password: true }
    });
    
    console.log('\nVerifying new password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', isValid ? '✅ VALID' : '❌ INVALID');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetStudentPassword();
