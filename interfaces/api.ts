import { NextResponse } from 'next/server';

// API Response Interfaces
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  status?: number;
}

// NextResponse type aliases for better type safety
export type ProjectResponse = NextResponse<Project | ApiErrorResponse>;
export type ProjectsResponse = NextResponse<Project[] | ApiErrorResponse>;
export type TrackingResponse = NextResponse<{
  success: boolean;
  eventId: string;
  updated?: boolean;
  pageChange?: boolean;
} | ApiErrorResponse>;
export type RealtimeStatsResponse = NextResponse<{
  count: number;
  visitors: VisitorDetail[];
} | ApiErrorResponse>;
export type WeeklyStatsResponse = NextResponse<DailyStats[] | ApiErrorResponse>;
export type CountriesStatsResponse = NextResponse<CountryStats[] | ApiErrorResponse>;
export type ReferrersStatsResponse = NextResponse<ReferrerStats[] | ApiErrorResponse>;
export type StripeCheckoutResponse = NextResponse<{
  url: string;
  sessionId: string;
} | ApiErrorResponse>;

// Session and Authentication Interfaces
export interface SessionUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// Project Interfaces
export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
}

// Event and Tracking Interfaces
export interface Event {
  id: string;
  projectId: string;
  sessionId?: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  ip: string;
  country: string;
  city: string;
  timestamp: Date;
}

export interface TrackingRequest {
  projectId: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  sessionId?: string;
}

// Geolocation Interfaces
export interface LocationData {
  country: string;
  city: string;
}

export interface IpLocationResponse {
  status: string;
  country?: string;
  city?: string;
}

// Stats Interfaces
export interface VisitorDetail {
  id: string;
  pageUrl: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  userAgent: string;
  timestamp: Date;
  sessionId: string | null;
}

export interface DailyStats {
  date: string;
  visitors: number;
}

export interface CountryStats {
  country: string;
  visitors: number;
}

export interface ReferrerStats {
  referrer: string;
  visitors: number;
}

// Stripe Interfaces
export interface StripeCheckoutRequest {
  plan: string;
}

// Real-time Communication Interfaces
export interface RealtimeMessage {
  type: 'stats' | 'error' | 'update';
  data?: unknown;
  message?: string;
}

export interface RealtimeStats {
  count: number;
  visitors: VisitorDetail[];
}

// CORS Headers Interface
export interface CorsHeaders {
  [key: string]: string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
}

// Request Context Interfaces
export interface RequestParams {
  id: string;
}

export interface RequestContext {
  params: Promise<RequestParams>;
}

// Database Query Interfaces
export interface EventFilters {
  projectId: string;
  timestamp?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface ProjectFilters {
  userId: string;
  id?: string;
}

// Utility Interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
} 