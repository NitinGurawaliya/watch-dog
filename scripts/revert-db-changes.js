const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function revertDatabaseChanges() {
  try {
    console.log('🔄 Reverting database changes...\n');

    // Check if plan column exists
    console.log('1. Checking current database state...');
    
    const userCount = await prisma.user.count();
    console.log(`Total users: ${userCount}`);

    // Try to query the plan field to see if it exists
    try {
      const usersWithPlan = await prisma.$queryRaw`
        SELECT id, email, plan 
        FROM "User" 
        LIMIT 1
      `;
      console.log('✅ Plan column exists in database');
    } catch (error) {
      console.log('❌ Plan column does not exist in database');
      return;
    }

    // Remove the plan column
    console.log('\n2. Removing plan column from User table...');
    
    await prisma.$executeRaw`ALTER TABLE "User" DROP COLUMN IF EXISTS "plan"`;
    console.log('✅ Plan column removed successfully');

    // Verify the change
    console.log('\n3. Verifying changes...');
    try {
      await prisma.$queryRaw`
        SELECT id, email, plan 
        FROM "User" 
        LIMIT 1
      `;
      console.log('❌ Plan column still exists - removal failed');
    } catch (error) {
      console.log('✅ Plan column successfully removed');
    }

    // Test that users can still be queried
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log('\n4. Testing user queries...');
    console.log(`✅ Successfully queried ${users.length} users without plan field`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name || 'No name'})`);
    });

    console.log('\n🎉 Database successfully reverted to previous state!');

  } catch (error) {
    console.error('❌ Error reverting database changes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

revertDatabaseChanges(); 