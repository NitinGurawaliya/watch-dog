const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserPlans() {
  try {
    console.log('Updating user plans...');
    
    // First, let's see what users we have
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        plan: true
      }
    });
    
    console.log('Current users and their plans:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.plan || 'NULL'}`);
    });
    
    // Update all users to have 'FREE' plan (this will set it for all users)
    const result = await prisma.user.updateMany({
      data: {
        plan: 'FREE'
      }
    });
    
    console.log(`Updated ${result.count} users to have 'FREE' plan`);
    
    // Verify the update
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        plan: true
      }
    });
    
    console.log('Updated users and their plans:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.plan}`);
    });
    
  } catch (error) {
    console.error('Error updating user plans:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPlans(); 