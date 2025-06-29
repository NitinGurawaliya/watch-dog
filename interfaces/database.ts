import { User, Project, Event } from '@prisma/client';

// Base database interfaces
export interface DatabaseUser extends User {}
export interface DatabaseProject extends Project {}
export interface DatabaseEvent extends Event {}

// Query result interfaces
export interface UserWithProjects extends DatabaseUser {
  projects: DatabaseProject[];
}

export interface ProjectWithEvents extends DatabaseProject {
  events: DatabaseEvent[];
  user: DatabaseUser;
}

export interface EventWithProject extends DatabaseEvent {
  project: DatabaseProject;
}

// Query filter interfaces
export interface UserFilters {
  id?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface ProjectFilters {
  id?: string;
  userId?: string;
  name?: string;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface EventFilters {
  id?: string;
  projectId?: string;
  sessionId?: string;
  ip?: string;
  country?: string;
  city?: string;
  timestamp?: {
    gte?: Date;
    lte?: Date;
  };
  pageUrl?: string;
}

// Query options interfaces
export interface QueryOptions {
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  include?: {
    [key: string]: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface StatsQueryOptions {
  timeRange?: {
    start: Date;
    end: Date;
  };
  groupBy?: string;
  limit?: number;
}

// Aggregation result interfaces
export interface VisitorStats {
  count: number;
  uniqueVisitors: number;
  pageViews: number;
}

export interface DailyStats {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface CountryStats {
  country: string;
  visitors: number;
  percentage: number;
}

export interface ReferrerStats {
  referrer: string;
  visitors: number;
  percentage: number;
}

export interface PageStats {
  pageUrl: string;
  visitors: number;
  pageViews: number;
}

// Real-time interfaces
export interface RealtimeVisitor {
  id: string;
  pageUrl: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  userAgent: string;
  timestamp: Date;
  sessionId: string | null;
  ip: string;
}

export interface RealtimeStats {
  count: number;
  visitors: RealtimeVisitor[];
}

// Database operation result interfaces
export interface CreateResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpdateResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  updated: boolean;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Transaction interfaces
export interface TransactionOptions {
  timeout?: number;
  maxWait?: number;
}

export interface BatchOperation<T> {
  create?: Partial<T>[];
  update?: { where: any; data: Partial<T> }[];
  delete?: any[];
}

// Database connection interfaces
export interface DatabaseConnection {
  isConnected: boolean;
  lastPing?: Date;
}

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: Date;
} 