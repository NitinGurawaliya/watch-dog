import { NextRequest } from 'next/server';
import { 
  requireAuth, 
  createErrorResponse, 
  createSuccessResponse,
  verifyProjectOwnership
} from '@/lib/api-utils';
import { 
  RequestContext, 
  WeeklyStatsResponse
} from '../../../../../../interfaces/api';
import { EventQueries } from '../../../../../../queries';

export async function GET(
  request: NextRequest,
  { params }: RequestContext
): Promise<WeeklyStatsResponse> {
  try {
    const user = await requireAuth();
    const { id: projectId } = await params;

    // Verify project belongs to user
    await verifyProjectOwnership(projectId, user.id);

    // Get daily stats for the last 7 days
    const result = await EventQueries.getDailyStats(projectId, 7);

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to get daily stats', 500);
    }

    return createSuccessResponse(result.data!);
  } catch (error) {
    console.error('7-day stats error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return createErrorResponse('Unauthorized', 401);
      }
      if (error.message.includes('Project not found')) {
        return createErrorResponse('Project not found', 404);
      }
    }
    return createErrorResponse('Internal server error', 500);
  }
} 