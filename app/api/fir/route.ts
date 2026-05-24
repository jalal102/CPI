import { NextRequest, NextResponse } from 'next/server';
import { MOCK_FIRS } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const crimeType = searchParams.get('crimeType');

  let firs = [...MOCK_FIRS];

  if (status) firs = firs.filter(f => f.status === status);
  if (priority) firs = firs.filter(f => f.priority === priority);
  if (crimeType) firs = firs.filter(f => f.crimeType === crimeType);

  return NextResponse.json({
    success: true,
    total: firs.length,
    open: firs.filter(f => f.status === 'open').length,
    solved: firs.filter(f => f.status === 'solved').length,
    firs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { complainant, phone, crimeType, date, location, description, assignedOfficer, priority } = body;

    if (!complainant || !crimeType || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFIR = {
      id: `fir-${Date.now()}`,
      firNumber: `FIR-2024-${Math.floor(Math.random() * 9000 + 1000)}`,
      complainant,
      phone: phone || 'N/A',
      crimeType,
      date: date || new Date().toISOString().split('T')[0],
      location,
      description,
      status: 'open' as const,
      assignedOfficer: assignedOfficer || 'Unassigned',
      priority: priority || 'medium',
      evidence: [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, fir: newFIR }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
