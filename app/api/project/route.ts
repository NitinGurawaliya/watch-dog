import { NextRequest } from 'next/server';
import { 
  requireAuth, 
  createErrorResponse, 
  createSuccessResponse
} from '@/lib/api-utils';
import { 
  CreateProjectRequest, 
  ProjectResponse, 
  ProjectsResponse 
} from '../../../interfaces/api';
import { ProjectQueries } from '../../../queries';

export async function POST(request: NextRequest): Promise<ProjectResponse> {
  try {
    const user = await requireAuth();
    const body: CreateProjectRequest = await request.json();

    if (!body.name) {
      return createErrorResponse('Missing required field: name', 400);
    }

    // Check for duplicate project name for this user
    const existing = await ProjectQueries.findMany({ userId: user.id, name: body.name });
    if (existing.success && existing.data && existing.data.length > 0) {
      return createErrorResponse('Project with this name already exists', 409);
    }

    const result = await ProjectQueries.create({
      name: body.name,
      userId: user.id,
    });

    if (!result.success || !result.data) {
      return createErrorResponse('Failed to create project', 500);
    }

    return createSuccessResponse(result.data, 201);
  } catch (error) {
    console.error('Create project error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return createErrorResponse('Unauthorized', 401);
      }
    }
    return createErrorResponse('Internal server error', 500);
  }
}

export async function GET(): Promise<ProjectsResponse> {
  try {
    const user = await requireAuth();

    const result = await ProjectQueries.findByUserId(user.id);

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to fetch projects', 500);
    }

    return createSuccessResponse(result.data || []);
  } catch (error) {
    console.error('Project fetch error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 