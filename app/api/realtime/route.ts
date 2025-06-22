import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { connections, sendStats } from '@/lib/broadcaster';

interface SessionUser {
  id: string;
  email?: string;
  name?: string;
}

// Store active connections are now in lib/broadcaster.ts

export async function GET(
  request: NextRequest,
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || !(session.user as SessionUser).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

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

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store connection
        connections.set(projectId, controller);

        // Send initial data
        controller.enqueue(`data: ${JSON.stringify({ type: 'connected', projectId })}\n\n`);

        // Send initial stats
        sendStats(projectId, controller);

        // Set up periodic updates
        const interval = setInterval(async () => {
          try {
            await sendStats(projectId, controller);
          } catch (error) {
            console.error('Error sending stats:', error);
            clearInterval(interval);
            connections.delete(projectId);
            controller.close();
          }
        }, 5000); // Update every 5 seconds

        // Clean up on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          connections.delete(projectId);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('SSE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}