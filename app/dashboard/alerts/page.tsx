'use client';

import { useState } from 'react';
import { MOCK_ALERTS, Alert } from '@/lib/data';
import toast from 'react-hot-toast';
import { Bell, AlertTriangle, Info, CheckCircle, X, Zap, MapPin, Clock, Radio } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filtered = alerts.filter(a => {
    const typeMatch = filter === 'all' || a.type === filter;
    const ackMatch = showAcknowledged ? true : !a.acknowledged;
    return typeMatch && ackMatch;
  });

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success('Alert acknowledged');
  };

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    toast.success('All alerts acknowledged');
  };

  const dismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert dismissed');
  };

  const unackCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;

  const AlertIcon = ({ type }: { type: string }) => {
    if (type === 'critical') return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (type === 'warning') return <Zap className="w-5 h-5 text-yellow-400" />;
    return <Info className="w-5 h-5 text-blue-400" />;
  };

  const alertCls = (type: string) =>
    type === 'critical' ? 'alert-critical' : type === 'warning' ? 'alert-warning' : 'alert-info';

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m ago`;
    return `${m}m ago`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400 tracking-wider">EMERGENCY ALERT SYSTEM</span>
          </div>
          <h1 className="font-display text-xl text-slate-100 tracking-wider">ALERTS & NOTIFICATIONS</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            {unackCount} unacknowledged · {criticalCount} critical · AI-monitored
          </p>
        </div>
        {unackCount > 0 && (
          <button onClick={acknowledgeAll} className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Acknowledge All
          </button>
        )}
      </div>

      {/* Critical Banner */}
      {criticalCount > 0 && (
        <div className="cyber-card rounded-lg p-4 glow-border-danger">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="font-display text-sm text-red-400 tracking-wider">
                ⚠ {criticalCount} CRITICAL ALERT{criticalCount > 1 ? 'S' : ''} REQUIRE IMMEDIATE ATTENTION
              </div>
              <p className="text-slate-500 font-mono text-xs mt-0.5">
                Emergency response protocols may need to be activated
              </p>
            </div>
            <div className="ml-auto">
              <div className="status-dot status-dot-danger" />
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Alerts', value: alerts.length, color: '#0ea5e9', icon: Bell },
          { label: 'Critical', value: alerts.filter(a => a.type === 'critical').length, color: '#ef4444', icon: AlertTriangle },
          { label: 'Warning', value: alerts.filter(a => a.type === 'warning').length, color: '#f59e0b', icon: Zap },
          { label: 'Acknowledged', value: alerts.filter(a => a.acknowledged).length, color: '#10b981', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="cyber-card rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="stat-number text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-slate-500 font-mono text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="cyber-card rounded-lg p-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(['all','critical','warning','info'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50'
                  : 'text-slate-500 border border-slate-800 hover:border-brand-500/30'
              }`}>
              {f}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 ml-auto cursor-pointer">
          <input type="checkbox" checked={showAcknowledged} onChange={e => setShowAcknowledged(e.target.checked)}
            className="w-3 h-3 accent-brand-400" />
          <span className="font-mono text-xs text-slate-400">Show acknowledged</span>
        </label>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className={`${alertCls(a.type)} rounded-lg p-4 relative transition-all ${a.acknowledged ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <AlertIcon type={a.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-display text-sm tracking-wider ${
                        a.type === 'critical' ? 'text-red-400' :
                        a.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>{a.title}</span>
                      {a.acknowledged && (
                        <span className="badge badge-low text-xs">ACKNOWLEDGED</span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{a.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {a.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                          <MapPin className="w-3 h-3" />
                          {a.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <Clock className="w-3 h-3" />
                        {timeAgo(a.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!a.acknowledged && (
                      <button onClick={() => acknowledge(a.id)}
                        className="text-xs font-mono px-3 py-1 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
                        ACK
                      </button>
                    )}
                    <button onClick={() => dismiss(a.id)}
                      className="text-slate-600 hover:text-slate-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 cyber-card rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
            <p className="font-display text-lg text-slate-400 tracking-wider">ALL CLEAR</p>
            <p className="font-mono text-sm text-slate-600 mt-1">No alerts matching current filters</p>
          </div>
        )}
      </div>

      {/* Emergency Actions */}
      <div className="cyber-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-4 h-4 text-red-400" />
          <h3 className="font-display text-sm text-slate-200 tracking-wider">EMERGENCY ACTIONS</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Broadcast Alert', color: '#ef4444', action: () => toast.success('Emergency broadcast sent!') },
            { label: 'Deploy Units', color: '#f59e0b', action: () => toast.success('Patrol units deployed!') },
            { label: 'Lock Down Zone', color: '#8b5cf6', action: () => toast.success('Zone lockdown initiated!') },
            { label: 'Request Backup', color: '#10b981', action: () => toast.success('Backup requested!') },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              className="py-3 rounded border font-display text-xs tracking-wider transition-all hover:scale-105"
              style={{
                background: `${btn.color}15`,
                borderColor: `${btn.color}40`,
                color: btn.color,
              }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
