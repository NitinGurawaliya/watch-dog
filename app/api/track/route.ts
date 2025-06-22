import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple IP detection from headers
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'Unknown';
}

// Simple country detection from headers (Cloudflare)
function getCountry(request: NextRequest): string {
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry;
  }
  return 'Unknown';
}

// Simple city detection from headers (Cloudflare)
function getCity(request: NextRequest): string {
  const cfCity = request.headers.get('cf-ipcity');
  if (cfCity) {
    return cfCity;
  }
  return 'Unknown';
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
    const { projectId, pageUrl, referrer, userAgent } = body;

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
    const country = getCountry(request);
    const city = getCity(request);

    // Create event
    const event = await prisma.event.create({
      data: {
        projectId,
        pageUrl,
        referrer: referrer || '',
        userAgent: userAgent || '',
        ip: ip,
        country: country,
        city: city,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id }, { headers: corsHeaders });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 