import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/data';

const VALID_PASSWORDS: Record<string, string> = {
  'admin@cpis.gov': 'admin123',
  'analyst@cpis.gov': 'analyst123',
  'officer@cpis.gov': 'officer123',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (VALID_PASSWORDS[email] !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        badge: user.badge,
        department: user.department,
      },
      token: `mock-jwt-${user.id}-${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
