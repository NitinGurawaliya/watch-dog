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

    // Get events from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const events = await prisma.event.findMany({
      where: {
        projectId,
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        country: true,
        ip: true,
      },
    });

    // Count unique visitors by country
    const countryStats: { [key: string]: Set<string> } = {};
    
    events.forEach(event => {
      const country = event.country || 'Unknown';
      if (!countryStats[country]) {
        countryStats[country] = new Set();
      }
      countryStats[country].add(event.ip);
    });

    // Convert to array format for charts
    const chartData = Object.entries(countryStats)
      .map(([country, visitors]) => ({
        country,
        visitors: visitors.size,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10); // Top 10 countries

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Countries stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 