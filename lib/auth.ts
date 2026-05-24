import { MOCK_USERS } from './data';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'officer';
  badge: string;
  department: string;
}

const SESSION_KEY = 'cpis_session';

export function login(email: string, password: string): SessionUser | null {
  // Demo credentials check
  const validPasswords: Record<string, string> = {
    'admin@cpis.gov': 'admin123',
    'analyst@cpis.gov': 'analyst123',
    'officer@cpis.gov': 'officer123',
  };

  if (validPasswords[email] !== password) return null;

  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) return null;

  const session: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    badge: user.badge,
    department: user.department,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function getRoleColor(role: string) {
  switch (role) {
    case 'admin': return 'text-red-400';
    case 'analyst': return 'text-blue-400';
    case 'officer': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export function getRoleBadge(role: string) {
  switch (role) {
    case 'admin': return { label: 'ADMIN', cls: 'badge-critical' };
    case 'analyst': return { label: 'ANALYST', cls: 'badge-medium' };
    case 'officer': return { label: 'OFFICER', cls: 'badge-low' };
    default: return { label: 'USER', cls: 'badge-pending' };
  }
}
