const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database...\n');

    // Check if we can connect
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Count records in each table
    console.log('2. Checking table counts...');
    
    const userCount = await prisma.user.count();
    console.log(`Users: ${userCount}`);
    
    const projectCount = await prisma.project.count();
    console.log(`Projects: ${projectCount}`);
    
    const eventCount = await prisma.event.count();
    console.log(`Events: ${eventCount}\n`);

    // Get recent events
    console.log('3. Recent events (last 10):');
    const recentEvents = await prisma.event.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    if (recentEvents.length === 0) {
      console.log('❌ No events found in database');
    } else {
      recentEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.project.name} - ${event.pageUrl} (${event.country}, ${event.city}) - ${event.timestamp}`);
      });
    }

    // Get projects with their event counts
    console.log('\n4. Projects with event counts:');
    const projectsWithCounts = await prisma.project.findMany({
      include: {
        _count: {
          select: { events: true }
        }
      }
    });

    projectsWithCounts.forEach(project => {
      console.log(`- ${project.name} (${project.id}): ${project._count.events} events`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase(); 