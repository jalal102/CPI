'use client';

import {
  CRIME_TREND_DATA, CRIME_BY_TYPE_DATA, HOURLY_CRIME_DATA,
  PREDICTION_DATA, AREA_RISK_DATA
} from '@/lib/data';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { Brain, TrendingUp, Target, AlertTriangle, Activity, Cpu } from 'lucide-react';

const TT_STYLE = {
  contentStyle: { background: '#0d1424', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11 },
};

const RADAR_DATA = [
  { subject: 'Robbery', A: 82 }, { subject: 'Assault', A: 91 },
  { subject: 'Fraud', A: 64 }, { subject: 'Cybercrime', A: 73 },
  { subject: 'Drugs', A: 88 }, { subject: 'Homicide', A: 45 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-brand-400" />
          <span className="font-mono text-xs text-brand-400 tracking-wider">AI ANALYTICS ENGINE</span>
        </div>
        <h1 className="font-display text-xl text-slate-100 tracking-wider">CRIME ANALYTICS & PREDICTIONS</h1>
        <p className="text-slate-500 font-mono text-xs mt-1">AI-powered analysis · 94.2% prediction accuracy · Real-time processing</p>
      </div>

      {/* AI Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Brain, label: 'AI Prediction Accuracy', value: '94.2%', color: '#10b981', desc: 'Based on 6-month model training' },
          { icon: Target, label: 'Crime Prevented (AI)', value: '23', color: '#0ea5e9', desc: 'This month via early detection' },
          { icon: TrendingUp, label: 'Trend Direction', value: 'RISING', color: '#ef4444', desc: '+18% compared to last month' },
        ].map(c => (
          <div key={c.label} className="cyber-card rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}20` }}>
                <c.icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <div className="font-mono text-xs text-slate-500 uppercase tracking-wider">{c.label}</div>
            </div>
            <div className="stat-number text-3xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
            <div className="text-slate-600 font-mono text-xs">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Crime Trend */}
      <div className="cyber-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-sm text-slate-200 tracking-wider">MULTI-CRIME TREND ANALYSIS</h3>
            <p className="text-slate-600 font-mono text-xs mt-1">June–November 2024 · 6-month comparative view</p>
          </div>
          <span className="badge badge-medium">HISTORICAL</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={CRIME_TREND_DATA}>
            <defs>
              {[
                ['robbery','#f59e0b'],['assault','#ef4444'],['fraud','#8b5cf6'],
                ['cybercrime','#06b6d4'],['drugs','#ec4899'],['homicide','#dc2626']
              ].map(([k, c]) => (
                <linearGradient key={k} id={`ag-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.08)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip {...TT_STYLE} />
            <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
            {[
              ['robbery','#f59e0b'],['assault','#ef4444'],['fraud','#8b5cf6'],
              ['cybercrime','#06b6d4'],['drugs','#ec4899'],['homicide','#dc2626']
            ].map(([k, c]) => (
              <Area key={k} type="monotone" dataKey={k} stroke={c} fill={`url(#ag-${k})`} strokeWidth={1.5} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Crime Distribution Pie */}
        <div className="cyber-card rounded-lg p-5">
          <h3 className="font-display text-sm text-slate-200 tracking-wider mb-5">CRIME TYPE DISTRIBUTION</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={CRIME_BY_TYPE_DATA} cx="50%" cy="50%" outerRadius={75} innerRadius={45}
                  dataKey="value" stroke="none" paddingAngle={2}>
                  {CRIME_BY_TYPE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...TT_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {CRIME_BY_TYPE_DATA.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs font-mono text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300">{d.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(d.value / 31) * 100}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Area Risk */}
        <div className="cyber-card rounded-lg p-5">
          <h3 className="font-display text-sm text-slate-200 tracking-wider mb-5">AREA RISK INDEX</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={AREA_RISK_DATA} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="area" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip {...TT_STYLE} formatter={(v) => [`${v}%`, 'Risk Score']} />
              <Bar dataKey="risk" radius={[0, 4, 4, 0]}>
                {AREA_RISK_DATA.map((e, i) => (
                  <Cell key={i} fill={e.risk >= 85 ? '#ef4444' : e.risk >= 70 ? '#f59e0b' : '#0ea5e9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            {[['#ef4444','Critical (85+)'],['#f59e0b','High (70-84)'],['#0ea5e9','Medium (<70)']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Prediction */}
        <div className="cyber-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-brand-400" />
            <h3 className="font-display text-sm text-slate-200 tracking-wider">AI CRIME PREDICTION</h3>
          </div>
          <p className="text-slate-600 font-mono text-xs mb-5">Next 4 months forecast with confidence interval</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PREDICTION_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.08)" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip {...TT_STYLE} />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="predicted" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} name="Predicted Crimes" strokeDasharray="6 2" />
              <Line yAxisId="right" type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={1.5} dot={{ fill: '#10b981', r: 3 }} name="Confidence %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs text-yellow-400 font-bold mb-1">AI PREDICTION ALERT</div>
                <p className="text-slate-400 text-xs">Model predicts crime surge in December. Recommend 30% increase in patrol deployment in Saddar and GT Road areas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="cyber-card rounded-lg p-5">
          <h3 className="font-display text-sm text-slate-200 tracking-wider mb-5">CRIME SEVERITY RADAR</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(14,165,233,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} />
              <Radar name="Threat Level" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={1.5} />
              <Tooltip {...TT_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {RADAR_DATA.map(d => (
              <div key={d.subject} className="text-center">
                <div className="stat-number text-lg font-bold text-brand-400">{d.A}</div>
                <div className="text-slate-500 font-mono text-xs">{d.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Heatmap */}
      <div className="cyber-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4 text-brand-400" />
          <h3 className="font-display text-sm text-slate-200 tracking-wider">TEMPORAL CRIME PATTERN — 24HR HEATMAP</h3>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {HOURLY_CRIME_DATA.map((d, i) => {
            const intensity = d.crimes / 22;
            const color = d.crimes >= 18 ? `rgba(239,68,68,${intensity})` :
                          d.crimes >= 12 ? `rgba(245,158,11,${intensity})` :
                          `rgba(14,165,233,${intensity})`;
            return (
              <div key={i} className="heatmap-cell aspect-square rounded flex flex-col items-center justify-center"
                   style={{ background: color }} title={`${d.hour}:00 — ${d.crimes} crimes`}>
                <span className="text-white font-mono text-xs font-bold">{d.crimes}</span>
                <span className="text-white/60 font-mono text-[0.6rem]">{d.hour}h</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 justify-end text-xs font-mono text-slate-500">
          <span>LOW</span>
          <div className="flex gap-0.5">
            {[0.2,0.4,0.6,0.8,1].map(o => (
              <div key={o} className="w-4 h-3 rounded-sm" style={{ background: `rgba(14,165,233,${o})` }} />
            ))}
          </div>
          <span>HIGH</span>
        </div>
      </div>
    </div>
  );
}
