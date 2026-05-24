import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CRIMES } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');

  let crimes = [...MOCK_CRIMES];

  if (type) crimes = crimes.filter(c => c.type === type);
  if (severity) crimes = crimes.filter(c => c.severity === severity);
  if (status) crimes = crimes.filter(c => c.status === status);
  if (limit) crimes = crimes.slice(0, parseInt(limit));

  return NextResponse.json({
    success: true,
    total: crimes.length,
    crimes,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, severity, location, description, officerId } = body;

    if (!type || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCrime = {
      id: `c${Date.now()}`,
      firNumber: `FIR-2024-${Math.floor(Math.random() * 9000 + 1000)}`,
      type,
      severity: severity || 'medium',
      status: 'open',
      location,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      description,
      officerId: officerId || 'u3',
      witnesses: 0,
      evidence: [],
    };

    return NextResponse.json({ success: true, crime: newCrime }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
