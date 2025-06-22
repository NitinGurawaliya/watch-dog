import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || !(session.user as any).id) {
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
        userId: (session.user as any).id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get events from last minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const realtimeEvents = await prisma.event.findMany({
      where: {
        projectId,
        timestamp: {
          gte: oneMinuteAgo,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 50, // Limit to last 50 events
    });

    // Group by unique visitors (simplified by IP for now)
    const uniqueVisitors = new Set();
    const visitorDetails: any[] = [];

    realtimeEvents.forEach(event => {
      if (!uniqueVisitors.has(event.ip)) {
        uniqueVisitors.add(event.ip);
        visitorDetails.push({
          id: event.id,
          pageUrl: event.pageUrl,
          referrer: event.referrer,
          country: event.country,
          city: event.city,
          userAgent: event.userAgent,
          timestamp: event.timestamp,
        });
      }
    });

    return NextResponse.json({
      count: uniqueVisitors.size,
      visitors: visitorDetails,
    });
  } catch (error) {
    console.error('Realtime stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 