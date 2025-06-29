import { NextRequest } from 'next/server';
import { 
  requireAuth, 
  createErrorResponse, 
  createSuccessResponse,
  verifyProjectOwnership,
  validateProjectId
} from '@/lib/api-utils';
import { RequestContext } from '../../../../interfaces/api';
import { ProjectQueries } from '../../../../queries';

export async function DELETE(
  request: NextRequest,
  { params }: RequestContext
) {
  try {
    const user = await requireAuth();
    const { id: projectId } = await params;

    if (!validateProjectId(projectId)) {
      return createErrorResponse('Project ID is required', 400);
    }
    
    // Verify project exists and belongs to the user
    await verifyProjectOwnership(projectId, user.id);

    // Delete the project (cascading delete in schema.prisma will handle associated events)
    const result = await ProjectQueries.delete(projectId);

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to delete project', 500);
    }

    return createSuccessResponse({ message: 'Project deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return createErrorResponse('Unauthorized', 401);
      }
      if (error.message.includes('Project not found')) {
        return createErrorResponse('Project not found or you do not have permission to delete it', 404);
      }
    }
    return createErrorResponse('Internal server error', 500);
  }
} 