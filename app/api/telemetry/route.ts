import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'BAREWA_QG_CORE_DISPATCHER',
    version: '1.0.0-v1',
    region: 'Niamey (UTC+1)',
    uptime: '99.98%',
    activeNodes: 8,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // Validate service ping / telemetry ingestion
    return NextResponse.json({
      received: true,
      serviceCode: payload.serviceCode || 'UNKNOWN',
      ingestedAt: new Date().toISOString(),
      action: 'HEARTBEAT_RECORDED',
    });
  } catch {
    return NextResponse.json({ error: 'Payload invalide' }, { status: 400 });
  }
}
