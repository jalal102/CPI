import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ALERTS } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const unacknowledged = searchParams.get('unacknowledged');

  let alerts = [...MOCK_ALERTS];

  if (type) alerts = alerts.filter(a => a.type === type);
  if (unacknowledged === 'true') alerts = alerts.filter(a => !a.acknowledged);

  return NextResponse.json({
    success: true,
    total: alerts.length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
    alerts,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, message, location } = body;

    if (!type || !title || !message) {
      return NextResponse.json({ error: 'type, title, and message are required' }, { status: 400 });
    }

    const newAlert = {
      id: `a${Date.now()}`,
      type: type as 'critical' | 'warning' | 'info',
      title,
      message,
      location: location || undefined,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };

    return NextResponse.json({ success: true, alert: newAlert }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
