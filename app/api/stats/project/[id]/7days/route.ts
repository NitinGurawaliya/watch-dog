import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface SessionUser {
  id: string;
  email?: string;
  name?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || !(session.user as SessionUser).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: projectId } = await params;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: (session.user as SessionUser).id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get events from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const events = await prisma.event.findMany({
      where: {
        projectId,
        timestamp: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        timestamp: true,
        ip: true,
        sessionId: true,
      },
    });

    // Group by date and count unique visitors
    const dailyStats: { [key: string]: number } = {};
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = 0;
    }

    // Count unique visitors per day using sessions (preferred) or IPs (fallback)
    const visitorsByDay: { [key: string]: Set<string> } = {};
    
    events.forEach(event => {
      const dateKey = event.timestamp.toISOString().split('T')[0];
      if (!visitorsByDay[dateKey]) {
        visitorsByDay[dateKey] = new Set();
      }
      // Use sessionId if available, otherwise fall back to IP
      const visitorKey = event.sessionId || event.ip;
      visitorsByDay[dateKey].add(visitorKey);
    });

    // Update daily stats
    Object.keys(visitorsByDay).forEach(dateKey => {
      if (dailyStats.hasOwnProperty(dateKey)) {
        dailyStats[dateKey] = visitorsByDay[dateKey].size;
      }
    });

    // Convert to array format for charts
    const chartData = Object.entries(dailyStats).map(([date, count]) => ({
      date,
      visitors: count,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('7-day stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 