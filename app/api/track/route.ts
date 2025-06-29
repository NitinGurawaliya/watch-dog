import { NextRequest } from 'next/server';
import { broadcastUpdate } from '@/lib/broadcaster';
import { 
  createErrorResponse, 
  createSuccessResponse,
  validateProjectId,
  getClientIP,
  getCountry,
  getCity,
  getLocationFromIP,
  debugLog,
  handleCorsPreflight
} from '@/lib/api-utils';
import { 
  TrackingRequest, 
  TrackingResponse,
  LocationData 
} from '../../../interfaces/api';
import { ProjectQueries, EventQueries } from '../../../queries';

// Handle OPTIONS preflight requests for CORS
export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function POST(request: NextRequest): Promise<TrackingResponse> {
  try {
    const body: TrackingRequest = await request.json();
    const { projectId, pageUrl, referrer, userAgent, sessionId } = body;

    // Validate required fields
    if (!body.projectId || !body.pageUrl) {
      return createErrorResponse('Missing required fields: projectId, pageUrl', 400);
    }

    if (!validateProjectId(projectId)) {
      return createErrorResponse('Invalid project ID', 400);
    }

    // Verify project exists
    const projectResult = await ProjectQueries.findById(projectId);
    if (!projectResult.success || !projectResult.data) {
      return createErrorResponse('Project not found', 404);
    }

    // Detect IP and location from headers
    const ip = getClientIP(request);
    let country = getCountry(request);
    let city = getCity(request);

    // Debug logging for development
    debugLog('Tracking Debug Info:', {
      ip,
      country,
      city,
      pageUrl,
      sessionId,
      headers: {
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
        'x-real-ip': request.headers.get('x-real-ip'),
        'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
        'cf-ipcountry': request.headers.get('cf-ipcountry'),
        'x-vercel-ip-country': request.headers.get('x-vercel-ip-country'),
        'x-country': request.headers.get('x-country'),
        'x-geo-country': request.headers.get('x-geo-country'),
      }
    });

    // If we couldn't get location from headers, try IP geolocation
    if (country === 'Unknown' && ip !== 'Unknown') {
      const location: LocationData = await getLocationFromIP(ip);
      country = location.country;
      city = location.city;
      
      debugLog('IP Geolocation Result:', { ip, location });
    }

    // Check for recent events from the same session
    if (sessionId) {
      const existingEventResult = await EventQueries.findRecentBySession(projectId, sessionId, 5);

      if (existingEventResult.success && existingEventResult.data) {
        const existingEvent = existingEventResult.data;
        
        // Check if this is a page change (different URL)
        if (existingEvent.pageUrl === pageUrl) {
          // Same page, update the existing event
          const updateResult = await EventQueries.update(existingEvent.id, {
            referrer: referrer || '',
            userAgent: userAgent || '',
            timestamp: new Date(), // Update timestamp to show recent activity
          });

          if (!updateResult.success || !updateResult.data) {
            return createErrorResponse('Failed to update event', 500);
          }

          // Broadcast update for real-time updates
          try {
            await broadcastUpdate(projectId);
          } catch (error) {
            console.debug('Failed to broadcast update:', error);
          }

          return createSuccessResponse({ 
            success: true, 
            eventId: updateResult.data.id, 
            updated: true 
          });
        } else {
          // Different page, create a new event to show navigation
          const createResult = await EventQueries.create({
            projectId,
            sessionId: sessionId || '',
            pageUrl,
            referrer: referrer || '',
            userAgent: userAgent || '',
            ip: ip,
            country: country,
            city: city,
          });

          if (!createResult.success || !createResult.data) {
            return createErrorResponse('Failed to create event', 500);
          }

          // Broadcast update for real-time updates
          try {
            await broadcastUpdate(projectId);
          } catch (error) {
            console.debug('Failed to broadcast update:', error);
          }

          return createSuccessResponse({ 
            success: true, 
            eventId: createResult.data.id, 
            updated: false, 
            pageChange: true 
          });
        }
      }
    }

    // Create new event (first visit or no session)
    const createResult = await EventQueries.create({
      projectId,
      sessionId: sessionId || '',
      pageUrl,
      referrer: referrer || '',
      userAgent: userAgent || '',
      ip: ip,
      country: country,
      city: city,
    });

    if (!createResult.success || !createResult.data) {
      return createErrorResponse('Failed to create event', 500);
    }

    // Broadcast update for real-time updates
    try {
      await broadcastUpdate(projectId);
    } catch (error) {
      console.debug('Failed to broadcast update:', error);
    }

    return createSuccessResponse({ 
      success: true, 
      eventId: createResult.data.id, 
      updated: false 
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 