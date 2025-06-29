import { prisma } from '@/lib/prisma';
import { 
  DatabaseEvent, 
  EventWithProject, 
  EventFilters, 
  QueryOptions, 
  CreateResult, 
  UpdateResult, 
  DeleteResult, 
  QueryResult,
  RealtimeVisitor,
  RealtimeStats,
  DailyStats,
  CountryStats,
  ReferrerStats,
  PageStats,
  VisitorStats
} from '../interfaces/database';

export class EventQueries {
  /**
   * Find an event by ID
   */
  static async findById(id: string): Promise<QueryResult<DatabaseEvent>> {
    try {
      const event = await prisma.event.findUnique({
        where: { id }
      });

      return {
        success: true,
        data: event || undefined
      };
    } catch (error) {
      console.error('Error finding event by ID:', error);
      return {
        success: false,
        error: 'Failed to find event'
      };
    }
  }

  /**
   * Find events with filters
   */
  static async findMany(
    filters: EventFilters = {}, 
    options: QueryOptions = {}
  ): Promise<QueryResult<DatabaseEvent[]>> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.sessionId) where.sessionId = filters.sessionId;
      if (filters.ip) where.ip = filters.ip;
      if (filters.country) where.country = filters.country;
      if (filters.city) where.city = filters.city;
      if (filters.pageUrl) where.pageUrl = { contains: filters.pageUrl, mode: 'insensitive' };
      if (filters.timestamp) where.timestamp = filters.timestamp;

      const events = await prisma.event.findMany({
        where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy || { timestamp: 'desc' },
        include: options.include
      });

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error finding events:', error);
      return {
        success: false,
        error: 'Failed to find events'
      };
    }
  }

  /**
   * Find events by project ID
   */
  static async findByProjectId(projectId: string, options: QueryOptions = {}): Promise<QueryResult<DatabaseEvent[]>> {
    try {
      const events = await prisma.event.findMany({
        where: { projectId },
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy || { timestamp: 'desc' },
        include: options.include
      });

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error finding events by project ID:', error);
      return {
        success: false,
        error: 'Failed to find events'
      };
    }
  }

  /**
   * Find recent events for real-time stats
   */
  static async findRecentEvents(projectId: string, minutesAgo: number): Promise<QueryResult<DatabaseEvent[]>> {
    try {
      const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);
      
      const events = await prisma.event.findMany({
        where: {
          projectId,
          timestamp: {
            gte: timeThreshold
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      });

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error finding recent events:', error);
      return {
        success: false,
        error: 'Failed to find recent events'
      };
    }
  }

  /**
   * Find events in time range
   */
  static async findInTimeRange(
    projectId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<QueryResult<DatabaseEvent[]>> {
    try {
      const events = await prisma.event.findMany({
        where: {
          projectId,
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { timestamp: 'desc' }
      });

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error finding events in time range:', error);
      return {
        success: false,
        error: 'Failed to find events in time range'
      };
    }
  }

  /**
   * Find recent event by session
   */
  static async findRecentBySession(
    projectId: string, 
    sessionId: string, 
    minutesAgo: number
  ): Promise<QueryResult<DatabaseEvent>> {
    try {
      const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);
      
      const event = await prisma.event.findFirst({
        where: {
          projectId,
          sessionId,
          timestamp: {
            gte: timeThreshold
          }
        },
        orderBy: { timestamp: 'desc' }
      });

      return {
        success: true,
        data: event || undefined
      };
    } catch (error) {
      console.error('Error finding recent event by session:', error);
      return {
        success: false,
        error: 'Failed to find recent event'
      };
    }
  }

  /**
   * Create a new event
   */
  static async create(eventData: Partial<DatabaseEvent>): Promise<CreateResult<DatabaseEvent>> {
    try {
      const event = await prisma.event.create({
        data: eventData as any
      });

      return {
        success: true,
        data: event
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: 'Failed to create event'
      };
    }
  }

  /**
   * Update an event
   */
  static async update(
    id: string, 
    eventData: Partial<DatabaseEvent>
  ): Promise<UpdateResult<DatabaseEvent>> {
    try {
      const event = await prisma.event.update({
        where: { id },
        data: eventData
      });

      return {
        success: true,
        data: event,
        updated: true
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: 'Failed to update event',
        updated: false
      };
    }
  }

  /**
   * Delete an event
   */
  static async delete(id: string): Promise<DeleteResult> {
    try {
      await prisma.event.delete({
        where: { id }
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: 'Failed to delete event'
      };
    }
  }

  /**
   * Get real-time visitor stats
   */
  static async getRealtimeStats(projectId: string, minutesAgo: number = 1): Promise<QueryResult<RealtimeStats>> {
    try {
      const result = await this.findRecentEvents(projectId, minutesAgo);
      if (!result.success || !result.data) {
        return {
          success: false,
          error: 'Failed to get real-time stats'
        };
      }

      // Group by unique sessions (preferred) or IPs (fallback)
      const uniqueVisitors = new Set();
      const visitorDetails: RealtimeVisitor[] = [];

      result.data.forEach(event => {
        const visitorKey = event.sessionId || event.ip;
        
        if (!uniqueVisitors.has(visitorKey)) {
          uniqueVisitors.add(visitorKey);
          visitorDetails.push({
            id: event.id,
            pageUrl: event.pageUrl,
            referrer: event.referrer,
            country: event.country,
            city: event.city,
            userAgent: event.userAgent,
            timestamp: event.timestamp,
            sessionId: event.sessionId,
            ip: event.ip
          });
        }
      });

      return {
        success: true,
        data: {
          count: uniqueVisitors.size,
          visitors: visitorDetails
        }
      };
    } catch (error) {
      console.error('Error getting real-time stats:', error);
      return {
        success: false,
        error: 'Failed to get real-time stats'
      };
    }
  }

  /**
   * Get daily visitor stats
   */
  static async getDailyStats(projectId: string, days: number = 7): Promise<QueryResult<DailyStats[]>> {
    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const result = await this.findInTimeRange(projectId, startDate, endDate);
      if (!result.success || !result.data) {
        return {
          success: false,
          error: 'Failed to get daily stats'
        };
      }

      // Initialize daily stats with 0
      const dailyStats: { [key: string]: Set<string> } = {};
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        dailyStats[dateKey] = new Set();
      }

      // Count unique visitors per day
      result.data.forEach(event => {
        const dateKey = event.timestamp.toISOString().split('T')[0];
        if (dailyStats[dateKey]) {
          const visitorKey = event.sessionId || event.ip;
          dailyStats[dateKey].add(visitorKey);
        }
      });

      // Convert to array format
      const chartData: DailyStats[] = Object.entries(dailyStats).map(([date, visitors]) => ({
        date,
        visitors: visitors.size,
        pageViews: 0 // Could be calculated separately if needed
      }));

      return {
        success: true,
        data: chartData
      };
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return {
        success: false,
        error: 'Failed to get daily stats'
      };
    }
  }

  /**
   * Get country stats
   */
  static async getCountryStats(projectId: string, days: number = 30): Promise<QueryResult<CountryStats[]>> {
    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const result = await this.findInTimeRange(projectId, startDate, endDate);
      if (!result.success || !result.data) {
        return {
          success: false,
          error: 'Failed to get country stats'
        };
      }

      // Count unique visitors by country
      const countryStats: { [key: string]: Set<string> } = {};
      let totalVisitors = 0;
      
      result.data.forEach(event => {
        const country = event.country || 'Unknown';
        if (!countryStats[country]) {
          countryStats[country] = new Set();
        }
        const visitorKey = event.sessionId || event.ip;
        countryStats[country].add(visitorKey);
        totalVisitors++;
      });

      // Convert to array format and calculate percentages
      const chartData: CountryStats[] = Object.entries(countryStats)
        .map(([country, visitors]) => ({
          country,
          visitors: visitors.size,
          percentage: totalVisitors > 0 ? (visitors.size / totalVisitors) * 100 : 0
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10);

      return {
        success: true,
        data: chartData
      };
    } catch (error) {
      console.error('Error getting country stats:', error);
      return {
        success: false,
        error: 'Failed to get country stats'
      };
    }
  }

  /**
   * Get referrer stats
   */
  static async getReferrerStats(projectId: string, days: number = 30): Promise<QueryResult<ReferrerStats[]>> {
    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const result = await this.findInTimeRange(projectId, startDate, endDate);
      if (!result.success || !result.data) {
        return {
          success: false,
          error: 'Failed to get referrer stats'
        };
      }

      // Count unique visitors by referrer
      const referrerStats: { [key: string]: Set<string> } = {};
      let totalVisitors = 0;
      
      result.data.forEach(event => {
        let referrer = event.referrer || 'Direct';
        
        // Clean up referrer URLs
        if (referrer && referrer !== 'Direct') {
          try {
            const url = new URL(referrer);
            referrer = url.hostname;
          } catch {
            referrer = 'Direct';
          }
        }
        
        if (!referrerStats[referrer]) {
          referrerStats[referrer] = new Set();
        }
        const visitorKey = event.sessionId || event.ip;
        referrerStats[referrer].add(visitorKey);
        totalVisitors++;
      });

      // Convert to array format and calculate percentages
      const chartData: ReferrerStats[] = Object.entries(referrerStats)
        .map(([referrer, visitors]) => ({
          referrer,
          visitors: visitors.size,
          percentage: totalVisitors > 0 ? (visitors.size / totalVisitors) * 100 : 0
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10);

      return {
        success: true,
        data: chartData
      };
    } catch (error) {
      console.error('Error getting referrer stats:', error);
      return {
        success: false,
        error: 'Failed to get referrer stats'
      };
    }
  }

  /**
   * Get event count
   */
  static async count(filters: EventFilters = {}): Promise<number> {
    try {
      const where: any = {};
      
      if (filters.id) where.id = filters.id;
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.sessionId) where.sessionId = filters.sessionId;
      if (filters.ip) where.ip = filters.ip;
      if (filters.country) where.country = filters.country;
      if (filters.city) where.city = filters.city;
      if (filters.pageUrl) where.pageUrl = { contains: filters.pageUrl, mode: 'insensitive' };
      if (filters.timestamp) where.timestamp = filters.timestamp;

      return await prisma.event.count({ where });
    } catch (error) {
      console.error('Error counting events:', error);
      return 0;
    }
  }

  /**
   * Get event count by project
   */
  static async countByProject(projectId: string): Promise<number> {
    try {
      return await prisma.event.count({
        where: { projectId }
      });
    } catch (error) {
      console.error('Error counting events by project:', error);
      return 0;
    }
  }
} 