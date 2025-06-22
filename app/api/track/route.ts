import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcastUpdate } from '@/lib/broadcaster';

// Simple IP detection from headers
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xClientIP = request.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  if (xClientIP) {
    return xClientIP;
  }
  
  return 'Unknown';
}

// Enhanced country detection from headers
function getCountry(request: NextRequest): string {
  // Try various headers that might contain country information
  const cfCountry = request.headers.get('cf-ipcountry');
  const xCountry = request.headers.get('x-country');
  const xGeoCountry = request.headers.get('x-geo-country');
  const xVercelCountry = request.headers.get('x-vercel-ip-country');
  
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry;
  }
  if (xCountry) {
    return xCountry;
  }
  if (xGeoCountry) {
    return xGeoCountry;
  }
  if (xVercelCountry) {
    return xVercelCountry;
  }
  
  return 'Unknown';
}

// Enhanced city detection from headers
function getCity(request: NextRequest): string {
  const cfCity = request.headers.get('cf-ipcity');
  const xCity = request.headers.get('x-city');
  const xGeoCity = request.headers.get('x-geo-city');
  
  if (cfCity) {
    return cfCity;
  }
  if (xCity) {
    return xCity;
  }
  if (xGeoCity) {
    return xGeoCity;
  }
  
  return 'Unknown';
}

// Fallback IP geolocation using a free service
async function getLocationFromIP(ip: string): Promise<{ country: string; city: string }> {
  try {
    // Skip if IP is localhost or private
    if (ip === 'Unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return { country: 'Unknown', city: 'Unknown' };
    }
    
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown'
      };
    }
  } catch (error) {
    console.debug('IP geolocation failed:', error);
  }
  
  return { country: 'Unknown', city: 'Unknown' };
}

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, pageUrl, referrer, userAgent, sessionId } = body;

    // Validate required fields
    if (!projectId || !pageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, pageUrl' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Detect IP and location from headers
    const ip = getClientIP(request);
    let country = getCountry(request);
    let city = getCity(request);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Tracking Debug Info:', {
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
    }

    // If we couldn't get location from headers, try IP geolocation
    if (country === 'Unknown' && ip !== 'Unknown') {
      const location = await getLocationFromIP(ip);
      country = location.country;
      city = location.city;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('IP Geolocation Result:', { ip, location });
      }
    }

    // Check for recent events from the same session
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    if (sessionId) {
      const existingEvent = await prisma.event.findFirst({
        where: {
          projectId,
          sessionId,
          timestamp: {
            gte: fiveMinutesAgo,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      if (existingEvent) {
        // Check if this is a page change (different URL)
        if (existingEvent.pageUrl === pageUrl) {
          // Same page, update the existing event
          const updatedEvent = await prisma.event.update({
            where: { id: existingEvent.id },
            data: {
              referrer: referrer || '',
              userAgent: userAgent || '',
              timestamp: new Date(), // Update timestamp to show recent activity
            },
          });

          // Broadcast update for real-time updates
          try {
            await broadcastUpdate(projectId);
          } catch (error) {
            console.debug('Failed to broadcast update:', error);
          }

          return NextResponse.json({ success: true, eventId: updatedEvent.id, updated: true }, { headers: corsHeaders });
        } else {
          // Different page, create a new event to show navigation
          const newEvent = await prisma.event.create({
            data: {
              projectId,
              sessionId: sessionId || '',
              pageUrl,
              referrer: referrer || '',
              userAgent: userAgent || '',
              ip: ip,
              country: country,
              city: city,
            },
          });

          // Broadcast update for real-time updates
          try {
            await broadcastUpdate(projectId);
          } catch (error) {
            console.debug('Failed to broadcast update:', error);
          }

          return NextResponse.json({ success: true, eventId: newEvent.id, updated: false, pageChange: true }, { headers: corsHeaders });
        }
      }
    }

    // Create new event (first visit or no session)
    const event = await prisma.event.create({
      data: {
        projectId,
        sessionId: sessionId || '',
        pageUrl,
        referrer: referrer || '',
        userAgent: userAgent || '',
        ip: ip,
        country: country,
        city: city,
      },
    });

    // Broadcast update for real-time updates
    try {
      await broadcastUpdate(projectId);
    } catch (error) {
      console.debug('Failed to broadcast update:', error);
    }

    return NextResponse.json({ success: true, eventId: event.id, updated: false }, { headers: corsHeaders });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 