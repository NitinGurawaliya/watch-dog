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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      let interval: NodeJS.Timeout | null = null;

      const cleanup = () => {
        if (interval) {
          clearInterval(interval);
        }
        connections.delete(projectId);
      };
      
      try {
        const session = await getServerSession(authConfig);
        const user = session?.user as SessionUser;

        if (!user?.id) {
          throw new Error('Unauthorized');
        }

        const project = await prisma.project.findFirst({
          where: { id: projectId, userId: user.id },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        connections.set(projectId, controller);
        
        request.signal.addEventListener('abort', () => {
          console.log(`Client for project ${projectId} disconnected.`);
          cleanup();
          try {
            controller.close();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_e) {}
        });

        await sendStats(projectId, controller);

        interval = setInterval(async () => {
          if (!connections.has(projectId)) {
            cleanup();
            try {
              controller.close();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_e) {}
            return;
          }
          await sendStats(projectId, controller);
        }, 5000);

      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`SSE stream error for project ${projectId}:`, message);
        try {
            controller.enqueue(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
            controller.close();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch(_e) {}
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}