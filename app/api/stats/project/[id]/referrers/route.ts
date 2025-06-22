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
        referrer: true,
        ip: true,
        sessionId: true,
      },
    });

    // Count unique visitors by referrer using sessions (preferred) or IPs (fallback)
    const referrerStats: { [key: string]: Set<string> } = {};
    
    events.forEach(event => {
      let referrer = event.referrer || 'Direct';
      
      // Clean up referrer URLs
      if (referrer && referrer !== 'Direct') {
        try {
          const url = new URL(referrer);
          referrer = url.hostname;
        } catch {
          referrer = 'Direct';
        }
      }
      
      if (!referrerStats[referrer]) {
        referrerStats[referrer] = new Set();
      }
      // Use sessionId if available, otherwise fall back to IP
      const visitorKey = event.sessionId || event.ip;
      referrerStats[referrer].add(visitorKey);
    });

    // Convert to array format for charts
    const chartData = Object.entries(referrerStats)
      .map(([referrer, visitors]) => ({
        referrer,
        visitors: visitors.size,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10); // Top 10 referrers

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Referrers stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 