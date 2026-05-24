'use client';

import { useAuth } from '@/lib/AuthContext';
import { DASHBOARD_STATS, MOCK_CRIMES, MOCK_ALERTS, CRIME_TREND_DATA, CRIME_BY_TYPE_DATA, HOURLY_CRIME_DATA } from '@/lib/data';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield, AlertTriangle, TrendingUp, Users, FileText,
  Clock, MapPin, Activity, ChevronRight, Zap, Brain, Eye
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

function StatCard({ label, value, icon: Icon, color, sub, delta }: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; sub?: string; delta?: string;
}) {
  const [display, setDisplay] = useState(0);
  const numVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const end = numVal;
    const duration = 600;
    const step = end / (duration / 8);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [numVal]);

  return (
    <div className="cyber-card rounded-lg p-5 hover:glow-border transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
             style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {delta && (
          <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${color}20`, color }}>
            {delta}
          </span>
        )}
      </div>
      <div className="stat-number text-2xl font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
        {typeof value === 'string' && value.includes('%')
          ? `${display.toFixed(1)}%`
          : typeof value === 'string' && !value.includes('.')
          ? display.toLocaleString()
          : value}
      </div>
      <div className="text-slate-500 font-mono text-xs uppercase tracking-wider mt-1">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-1">{sub}</div>}
    </div>
  );
}

const CRIME_COLORS: Record<string, string> = {
  robbery: '#f59e0b', assault: '#ef4444', fraud: '#8b5cf6',
  cybercrime: '#06b6d4', drug_trafficking: '#ec4899', homicide: '#dc2626',
  burglary: '#10b981', theft: '#6b7280', kidnapping: '#f97316', vandalism: '#84cc16',
};

export default function DashboardPage() {
  const { user } = useAuth();

  const recentCrimes = MOCK_CRIMES.slice(0, 5);
  const criticalAlerts = MOCK_ALERTS.filter(a => a.type === 'critical' && !a.acknowledged).slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400 tracking-wider">COMMAND CENTER</span>
          </div>
          <h1 className="font-display text-2xl text-slate-100 tracking-wider">
            {greeting()}, {user?.name.split(' ')[1] || user?.name}
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' '} | Badge: {user?.badge} | {user?.department}
          </p>
        </div>

        {/* AI Threat Level */}
        <div className="cyber-card rounded-lg p-4 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400">AI THREAT LEVEL</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl text-red-400">HIGH</span>
          </div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{ width: '78%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
          </div>
          <div className="font-mono text-xs text-slate-500 mt-1">78 / 100 risk index</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Crimes" value={DASHBOARD_STATS.totalCrimes} icon={Shield} color="#0ea5e9" delta="+12%" />
        <StatCard label="Active Cases" value={DASHBOARD_STATS.activeCases} icon={AlertTriangle} color="#ef4444" delta="↑3" />
        <StatCard label="Solved Cases" value={DASHBOARD_STATS.solvedCases} icon={TrendingUp} color="#10b981" delta="+5%" />
        <StatCard label="Suspects" value={DASHBOARD_STATS.suspects} icon={Users} color="#f59e0b" />
        <StatCard label="Solution Rate" value={`${DASHBOARD_STATS.solutionRate}%`} icon={Activity} color="#8b5cf6" />
        <StatCard label="Response Time" value={DASHBOARD_STATS.avgResponseTime} icon={Clock} color="#06b6d4" sub="Average" />
        <StatCard label="Officers Active" value={DASHBOARD_STATS.officers} icon={Shield} color="#10b981" />
        <StatCard label="Alerts Today" value={DASHBOARD_STATS.alertsToday} icon={Zap} color="#f97316" delta="CRITICAL" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Crime Trend */}
        <div className="lg:col-span-2 cyber-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-sm text-slate-200 tracking-wider">CRIME TREND ANALYSIS</h3>
              <p className="text-slate-600 font-mono text-xs mt-1">Last 6 months</p>
            </div>
            <span className="badge badge-medium">LIVE DATA</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CRIME_TREND_DATA}>
              <defs>
                {['robbery', 'assault', 'fraud', 'cybercrime'].map((k, i) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={['#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={['#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ background: '#0d1424', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11 }} />
              {['robbery', 'assault', 'fraud', 'cybercrime'].map((k, i) => (
                <Area key={k} type="monotone" dataKey={k} stroke={['#f59e0b','#ef4444','#8b5cf6','#06b6d4'][i]}
                  fill={`url(#grad-${k})`} strokeWidth={1.5} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crime by Type */}
        <div className="cyber-card rounded-lg p-5">
          <h3 className="font-display text-sm text-slate-200 tracking-wider mb-5">CRIME DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CRIME_BY_TYPE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value" stroke="none">
                {CRIME_BY_TYPE_DATA.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1424', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CRIME_BY_TYPE_DATA.slice(0, 5).map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-400 text-xs font-mono">{d.name}</span>
                </div>
                <span className="text-slate-300 text-xs font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent FIRs */}
        <div className="cyber-card rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <h3 className="font-display text-sm text-slate-200 tracking-wider">RECENT FIRs</h3>
            </div>
            <Link href="/dashboard/fir" className="text-xs text-brand-400 font-mono hover:underline flex items-center gap-1">
              VIEW ALL <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="intel-table w-full">
            <thead>
              <tr>
                <th className="text-left">FIR No.</th>
                <th className="text-left">Type</th>
                <th className="text-left">Severity</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCrimes.map(c => (
                <tr key={c.id}>
                  <td className="text-brand-400">{c.firNumber}</td>
                  <td className="capitalize">{c.type.replace('_', ' ')}</td>
                  <td>
                    <span className={`badge badge-${c.severity}`}>
                      {c.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${c.status}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Critical Alerts */}
        <div className="cyber-card rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-display text-sm text-slate-200 tracking-wider">CRITICAL ALERTS</h3>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            </div>
            <Link href="/dashboard/alerts" className="text-xs text-brand-400 font-mono hover:underline flex items-center gap-1">
              VIEW ALL <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {criticalAlerts.map(a => (
              <div key={a.id} className="alert-critical p-3 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold text-red-400 mb-1">{a.title}</div>
                    <p className="text-slate-400 text-xs">{a.message}</p>
                    {a.location && (
                      <div className="flex items-center gap-1 mt-1.5 text-slate-500 text-xs">
                        <MapPin className="w-3 h-3" />
                        {a.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {criticalAlerts.length === 0 && (
              <div className="text-center py-6 text-slate-600 font-mono text-sm">
                No critical alerts at this time
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="cyber-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-sm text-slate-200 tracking-wider">HOURLY CRIME ACTIVITY PATTERN</h3>
            <p className="text-slate-600 font-mono text-xs mt-1">Peak hours identification for patrol deployment</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Eye className="w-3 h-3 text-brand-400" />
            AI MONITORED
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={HOURLY_CRIME_DATA}>
            <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} />
            <YAxis />
            <Tooltip
              formatter={(v) => [v, 'Crimes']}
              labelFormatter={(h) => `${h}:00`}
              contentStyle={{ background: '#0d1424', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11 }}
            />
            <Bar dataKey="crimes" radius={[2, 2, 0, 0]}>
              {HOURLY_CRIME_DATA.map((e, i) => (
                <Cell key={i} fill={e.crimes >= 18 ? '#ef4444' : e.crimes >= 12 ? '#f59e0b' : '#0ea5e9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          {[['#ef4444', 'High Activity (18+)'], ['#f59e0b', 'Medium (12-17)'], ['#0ea5e9', 'Low (<12)']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
