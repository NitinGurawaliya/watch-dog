import { prisma } from '@/lib/prisma';
import { 
  DatabaseProject, 
  ProjectWithEvents, 
  ProjectFilters, 
  QueryOptions, 
  CreateResult, 
  UpdateResult, 
  DeleteResult, 
  QueryResult 
} from '../interfaces/database';

export class ProjectQueries {
  /**
   * Find a project by ID
   */
  static async findById(id: string): Promise<QueryResult<DatabaseProject>> {
    try {
      const project = await prisma.project.findUnique({
        where: { id }
      });

      return {
        success: true,
        data: project || undefined
      };
    } catch (error) {
      console.error('Error finding project by ID:', error);
      return {
        success: false,
        error: 'Failed to find project'
      };
    }
  }

  /**
   * Find project by ID with user verification
   */
  static async findByIdAndUser(id: string, userId: string): Promise<QueryResult<DatabaseProject>> {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id,
          userId
        }
      });

      return {
        success: true,
        data: project || undefined
      };
    } catch (error) {
      console.error('Error finding project by ID and user:', error);
      return {
        success: false,
        error: 'Failed to find project'
      };
    }
  }

  /**
   * Find projects with filters
   */
  static async findMany(
    filters: ProjectFilters = {}, 
    options: QueryOptions = {}
  ): Promise<QueryResult<DatabaseProject[]>> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.userId) where.userId = filters.userId;
      if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };
      if (filters.createdAt) where.createdAt = filters.createdAt;

      const projects = await prisma.project.findMany({
        where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy || { createdAt: 'desc' },
        include: options.include
      });

      return {
        success: true,
        data: projects,
        count: projects.length
      };
    } catch (error) {
      console.error('Error finding projects:', error);
      return {
        success: false,
        error: 'Failed to find projects'
      };
    }
  }

  /**
   * Find projects by user ID
   */
  static async findByUserId(userId: string): Promise<QueryResult<DatabaseProject[]>> {
    try {
      const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: projects,
        count: projects.length
      };
    } catch (error) {
      console.error('Error finding projects by user ID:', error);
      return {
        success: false,
        error: 'Failed to find projects'
      };
    }
  }

  /**
   * Find project with events
   */
  static async findWithEvents(projectId: string): Promise<QueryResult<ProjectWithEvents>> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          events: {
            orderBy: { timestamp: 'desc' }
          },
          user: true
        }
      });

      return {
        success: true,
        data: project as ProjectWithEvents || undefined
      };
    } catch (error) {
      console.error('Error finding project with events:', error);
      return {
        success: false,
        error: 'Failed to find project with events'
      };
    }
  }

  /**
   * Create a new project
   */
  static async create(projectData: Partial<DatabaseProject>): Promise<CreateResult<DatabaseProject>> {
    try {
      const project = await prisma.project.create({
        data: projectData as any
      });

      return {
        success: true,
        data: project
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: 'Failed to create project'
      };
    }
  }

  /**
   * Update a project
   */
  static async update(
    id: string, 
    projectData: Partial<DatabaseProject>
  ): Promise<UpdateResult<DatabaseProject>> {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: projectData
      });

      return {
        success: true,
        data: project,
        updated: true
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        error: 'Failed to update project',
        updated: false
      };
    }
  }

  /**
   * Delete a project
   */
  static async delete(id: string): Promise<DeleteResult> {
    try {
      await prisma.project.delete({
        where: { id }
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        error: 'Failed to delete project'
      };
    }
  }

  /**
   * Check if project exists
   */
  static async exists(id: string): Promise<boolean> {
    try {
      const count = await prisma.project.count({
        where: { id }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking project existence:', error);
      return false;
    }
  }

  /**
   * Check if project belongs to user
   */
  static async belongsToUser(projectId: string, userId: string): Promise<boolean> {
    try {
      const count = await prisma.project.count({
        where: {
          id: projectId,
          userId
        }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking project ownership:', error);
      return false;
    }
  }

  /**
   * Get project count
   */
  static async count(filters: ProjectFilters = {}): Promise<number> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.userId) where.userId = filters.userId;
      if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };
      if (filters.createdAt) where.createdAt = filters.createdAt;

      return await prisma.project.count({ where });
    } catch (error) {
      console.error('Error counting projects:', error);
      return 0;
    }
  }

  /**
   * Get project count by user
   */
  static async countByUser(userId: string): Promise<number> {
    try {
      return await prisma.project.count({
        where: { userId }
      });
    } catch (error) {
      console.error('Error counting projects by user:', error);
      return 0;
    }
  }
} 