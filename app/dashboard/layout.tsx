'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { getRoleBadge } from '@/lib/auth';
import { MOCK_ALERTS } from '@/lib/data';
import {
  Shield, LayoutDashboard, FileText, MapPin, BarChart3,
  Bell, Users, Settings, LogOut, Sun, Moon, Menu, X,
  AlertTriangle, ChevronRight, Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/dashboard/fir', icon: FileText, label: 'FIR Records' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/heatmap', icon: MapPin, label: 'Crime Map' },
  { href: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
  { href: '/dashboard/suspects', icon: Users, label: 'Suspects' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState('');

  const unacknowledgedAlerts = MOCK_ALERTS.filter(a => !a.acknowledged).length;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}>
        <div className="text-center">
          <div className="spinner w-10 h-10 mx-auto mb-4" />
          <p className="text-brand-400 font-mono text-sm tracking-widest">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(user.role);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-dark)' }}>

      {/* Scan line effect */}
      <div className="scanline" />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{
        background: theme === 'dark' ? '#080d1a' : '#f8fafc',
        borderRight: '1px solid rgba(14,165,233,0.15)',
      }}>

        {/* Logo */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                 style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 0 15px rgba(14,165,233,0.4)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display text-brand-400 text-sm tracking-widest leading-none">CPIS</div>
              <div className="text-slate-600 font-mono text-[0.6rem] tracking-widest">INTELLIGENCE</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-brand-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live status */}
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <Radio className="w-3 h-3 text-green-400 animate-pulse" />
          <span className="font-mono text-xs text-green-400">LIVE MONITORING</span>
          <span className="font-mono text-xs text-slate-600 ml-auto">{time}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? 'active' : ''}`}>
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.href === '/dashboard/alerts' && unacknowledgedAlerts > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-mono rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {unacknowledgedAlerts}
                  </span>
                )}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-dark-500 flex items-center justify-center border border-brand-500/30 text-brand-400 font-display text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate font-sans">{user.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`badge ${roleBadge.cls}`}>{roleBadge.label}</span>
                <span className="text-slate-600 font-mono text-xs">{user.badge}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={toggleTheme}
              className="btn-ghost flex-1 py-2 rounded text-xs flex items-center justify-center gap-1.5 transition-all">
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button onClick={logout}
              className="btn-ghost flex-1 py-2 rounded text-xs flex items-center justify-center gap-1.5 text-red-400 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 transition-all">
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 px-4 lg:px-6 py-3 flex items-center gap-4"
          style={{
            background: theme === 'dark' ? 'rgba(8,13,26,0.95)' : 'rgba(248,250,252,0.95)',
            borderBottom: '1px solid rgba(14,165,233,0.1)',
            backdropFilter: 'blur(12px)',
          }}>

          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-brand-400">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <span className="text-brand-400">CPIS</span>
            <span>/</span>
            <span className="text-slate-300 capitalize">
              {pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Alert indicator */}
            {unacknowledgedAlerts > 0 && (
              <Link href="/dashboard/alerts" className="relative">
                <Bell className="w-5 h-5 text-slate-400 hover:text-brand-400 transition-colors" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white font-mono text-[0.6rem] flex items-center justify-center animate-pulse-fast">
                  {unacknowledgedAlerts}
                </span>
              </Link>
            )}

            {/* Connection status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-green-500/20 bg-green-500/5">
              <div className="status-dot" />
              <span className="text-green-400 font-mono text-xs">CONNECTED</span>
            </div>

            {/* Theme toggle (header) */}
            <button onClick={toggleTheme} className="text-slate-400 hover:text-brand-400 transition-colors p-1">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto grid-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
