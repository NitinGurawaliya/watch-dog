import { prisma } from '@/lib/prisma';
import { 
  DatabaseUser, 
  UserWithProjects, 
  UserFilters, 
  QueryOptions, 
  CreateResult, 
  UpdateResult, 
  DeleteResult, 
  QueryResult 
} from '../interfaces/database';

export class UserQueries {
  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<QueryResult<DatabaseUser>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      return {
        success: true,
        data: user || undefined
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return {
        success: false,
        error: 'Failed to find user'
      };
    }
  }

  /**
   * Find a user by email
   */
  static async findByEmail(email: string): Promise<QueryResult<DatabaseUser>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      return {
        success: true,
        data: user || undefined
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return {
        success: false,
        error: 'Failed to find user'
      };
    }
  }

  /**
   * Find users with filters
   */
  static async findMany(
    filters: UserFilters = {}, 
    options: QueryOptions = {}
  ): Promise<QueryResult<DatabaseUser[]>> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.email) where.email = filters.email;
      if (filters.emailVerified !== undefined) where.emailVerified = filters.emailVerified;

      const users = await prisma.user.findMany({
        where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy,
        include: options.include
      });

      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error) {
      console.error('Error finding users:', error);
      return {
        success: false,
        error: 'Failed to find users'
      };
    }
  }

  /**
   * Find user with projects
   */
  static async findWithProjects(userId: string): Promise<QueryResult<UserWithProjects>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          projects: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      return {
        success: true,
        data: user as UserWithProjects || undefined
      };
    } catch (error) {
      console.error('Error finding user with projects:', error);
      return {
        success: false,
        error: 'Failed to find user with projects'
      };
    }
  }

  /**
   * Create a new user
   */
  static async create(userData: Partial<DatabaseUser>): Promise<CreateResult<DatabaseUser>> {
    try {
      const user = await prisma.user.create({
        data: userData as any
      });

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: 'Failed to create user'
      };
    }
  }

  /**
   * Update a user
   */
  static async update(
    id: string, 
    userData: Partial<DatabaseUser>
  ): Promise<UpdateResult<DatabaseUser>> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: userData
      });

      return {
        success: true,
        data: user,
        updated: true
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user',
        updated: false
      };
    }
  }

  /**
   * Delete a user
   */
  static async delete(id: string): Promise<DeleteResult> {
    try {
      await prisma.user.delete({
        where: { id }
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }
  }

  /**
   * Update user's email verification status
   */
  static async updateEmailVerification(
    email: string, 
    verified: boolean
  ): Promise<UpdateResult<DatabaseUser>> {
    try {
      const user = await prisma.user.update({
        where: { email },
        data: { emailVerified: verified ? new Date() : null }
      });

      return {
        success: true,
        data: user,
        updated: true
      };
    } catch (error) {
      console.error('Error updating email verification:', error);
      return {
        success: false,
        error: 'Failed to update email verification',
        updated: false
      };
    }
  }

  /**
   * Check if user exists
   */
  static async exists(id: string): Promise<boolean> {
    try {
      const count = await prisma.user.count({
        where: { id }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  /**
   * Get user count
   */
  static async count(filters: UserFilters = {}): Promise<number> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.email) where.email = filters.email;
      if (filters.emailVerified !== undefined) where.emailVerified = filters.emailVerified;

      return await prisma.user.count({ where });
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }
} 