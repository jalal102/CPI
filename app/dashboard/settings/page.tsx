'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import toast from 'react-hot-toast';
import {
  Settings, Sun, Moon, Bell, Shield, User, Lock, Monitor,
  Database, Cpu, Save, RefreshCw, Eye, EyeOff, CheckCircle,
  AlertTriangle, Globe, Map, BarChart3
} from 'lucide-react';

const SECTION = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="cyber-card rounded-lg overflow-hidden">
    <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
      <Icon className="w-4 h-4 text-brand-400" />
      <h3 className="font-display text-sm text-slate-200 tracking-wider">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'rgba(14,165,233,0.06)' }}>
    <div>
      <div className="text-sm text-slate-300 font-sans font-medium">{label}</div>
      {desc && <div className="text-xs text-slate-600 font-mono mt-0.5">{desc}</div>}
    </div>
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-brand-500' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Notification settings
  const [notifs, setNotifs] = useState({
    criticalAlerts: true, newFIR: true, suspectMatch: true,
    aiPrediction: true, systemUpdates: false, emailAlerts: true,
  });

  // System settings
  const [system, setSystem] = useState({
    autoRefresh: true, aiPrediction: true, facialRecognition: true,
    heatmapOverlay: true, realTimeTracking: true, dataEncryption: true,
    auditLog: true, twoFactor: false,
  });

  // Map settings
  const [mapRefresh, setMapRefresh] = useState('30');
  const [mapZoom, setMapZoom] = useState('13');

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  const saveSettings = () => toast.success('Settings saved successfully');

  const changePassword = () => {
    if (!pwForm.current) { toast.error('Enter current password'); return; }
    if (pwForm.new.length < 6) { toast.error('New password must be 6+ characters'); return; }
    if (pwForm.new !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    toast.success('Password updated successfully');
    setPwForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-brand-400" />
          <span className="font-mono text-xs text-brand-400 tracking-wider">SYSTEM CONFIGURATION</span>
        </div>
        <h1 className="font-display text-xl text-slate-100 tracking-wider">SETTINGS</h1>
        <p className="text-slate-500 font-mono text-xs mt-1">Configure system preferences and account settings</p>
      </div>

      {/* Account Info */}
      <SECTION title="ACCOUNT PROFILE" icon={User}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-xl bg-dark-500 border border-brand-500/30 flex items-center justify-center font-display text-2xl text-brand-400">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="font-display text-lg text-slate-100">{user?.name}</div>
            <div className="font-mono text-sm text-slate-500">{user?.email}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${user?.role === 'admin' ? 'badge-critical' : user?.role === 'analyst' ? 'badge-medium' : 'badge-low'}`}>
                {user?.role?.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-slate-600">{user?.badge}</span>
              <span className="font-mono text-xs text-slate-600">·</span>
              <span className="font-mono text-xs text-slate-600">{user?.department}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Display Name', value: user?.name || '' },
            { label: 'Department', value: user?.department || '' },
            { label: 'Badge Number', value: user?.badge || '' },
            { label: 'Email Address', value: user?.email || '' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
              <input defaultValue={f.value} className="cyber-input w-full px-3 py-2 rounded text-sm" />
            </div>
          ))}
        </div>
        <button onClick={saveSettings} className="btn-primary mt-4 px-5 py-2 rounded text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </SECTION>

      {/* Appearance */}
      <SECTION title="APPEARANCE & DISPLAY" icon={Monitor}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Theme selector */}
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">COLOR THEME</label>
            <div className="flex gap-3">
              {(['dark', 'light'] as const).map(t => (
                <button key={t} onClick={() => t !== theme && toggleTheme()}
                  className={`flex-1 py-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    theme === t ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-slate-600'
                  }`}>
                  {t === 'dark' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  <span className="font-mono text-xs text-slate-400 capitalize">{t} Mode</span>
                  {theme === t && <CheckCircle className="w-3 h-3 text-brand-400" />}
                </button>
              ))}
            </div>
          </div>
          {/* Accent */}
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">ACCENT COLOR</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { color: '#0ea5e9', label: 'Cyber Blue' },
                { color: '#10b981', label: 'Matrix Green' },
                { color: '#8b5cf6', label: 'Violet' },
                { color: '#ef4444', label: 'Red Alert' },
                { color: '#f59e0b', label: 'Amber' },
              ].map(c => (
                <button key={c.color} title={c.label}
                  onClick={() => toast.success(`Accent: ${c.label}`)}
                  className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white/30 transition-all"
                  style={{ background: c.color }} />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">FONT SIZE</label>
            <select className="cyber-input w-full px-3 py-2 rounded text-sm">
              <option>Small (12px)</option>
              <option selected>Medium (14px)</option>
              <option>Large (16px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">LANGUAGE</label>
            <select className="cyber-input w-full px-3 py-2 rounded text-sm">
              <option>English</option>
              <option>اردو (Urdu)</option>
              <option>Pashto</option>
            </select>
          </div>
        </div>
      </SECTION>

      {/* Notifications */}
      <SECTION title="NOTIFICATION PREFERENCES" icon={Bell}>
        <Toggle checked={notifs.criticalAlerts} onChange={v => setNotifs(p => ({ ...p, criticalAlerts: v }))}
          label="Critical Alerts" desc="Immediate popup for critical incidents" />
        <Toggle checked={notifs.newFIR} onChange={v => setNotifs(p => ({ ...p, newFIR: v }))}
          label="New FIR Registrations" desc="Notify when new FIR is logged" />
        <Toggle checked={notifs.suspectMatch} onChange={v => setNotifs(p => ({ ...p, suspectMatch: v }))}
          label="Facial Recognition Matches" desc="Alert when suspect is identified" />
        <Toggle checked={notifs.aiPrediction} onChange={v => setNotifs(p => ({ ...p, aiPrediction: v }))}
          label="AI Prediction Alerts" desc="Crime prediction notifications" />
        <Toggle checked={notifs.emailAlerts} onChange={v => setNotifs(p => ({ ...p, emailAlerts: v }))}
          label="Email Notifications" desc="Send alerts to registered email" />
        <Toggle checked={notifs.systemUpdates} onChange={v => setNotifs(p => ({ ...p, systemUpdates: v }))}
          label="System Updates" desc="Maintenance and update notifications" />
        <button onClick={saveSettings} className="btn-primary mt-4 px-5 py-2 rounded text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Notifications
        </button>
      </SECTION>

      {/* System / AI */}
      <SECTION title="SYSTEM & AI MODULES" icon={Cpu}>
        <div className="mb-3 p-3 rounded border border-brand-500/20 bg-brand-500/5">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400">
            <CheckCircle className="w-3 h-3" />
            All AI modules operational · Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <Toggle checked={system.aiPrediction} onChange={v => setSystem(p => ({ ...p, aiPrediction: v }))}
          label="AI Crime Prediction Engine" desc="Machine learning crime forecasting" />
        <Toggle checked={system.facialRecognition} onChange={v => setSystem(p => ({ ...p, facialRecognition: v }))}
          label="Facial Recognition System" desc="Real-time face matching against database" />
        <Toggle checked={system.realTimeTracking} onChange={v => setSystem(p => ({ ...p, realTimeTracking: v }))}
          label="Real-time Crime Tracking" desc="Live incident monitoring and updates" />
        <Toggle checked={system.heatmapOverlay} onChange={v => setSystem(p => ({ ...p, heatmapOverlay: v }))}
          label="Heatmap Overlay" desc="Dynamic crime density visualization" />
        <Toggle checked={system.autoRefresh} onChange={v => setSystem(p => ({ ...p, autoRefresh: v }))}
          label="Auto Refresh Dashboard" desc="Automatically refresh data every 30 seconds" />
        <Toggle checked={system.auditLog} onChange={v => setSystem(p => ({ ...p, auditLog: v }))}
          label="Audit Logging" desc="Log all user actions for compliance" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Map Refresh (sec)</label>
            <select value={mapRefresh} onChange={e => setMapRefresh(e.target.value)} className="cyber-input w-full px-3 py-2 rounded text-sm">
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Default Map Zoom</label>
            <select value={mapZoom} onChange={e => setMapZoom(e.target.value)} className="cyber-input w-full px-3 py-2 rounded text-sm">
              <option value="11">City (11)</option>
              <option value="13">District (13)</option>
              <option value="15">Street (15)</option>
            </select>
          </div>
        </div>
        <button onClick={saveSettings} className="btn-primary mt-4 px-5 py-2 rounded text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save System Settings
        </button>
      </SECTION>

      {/* Security */}
      <SECTION title="SECURITY & ACCESS CONTROL" icon={Lock}>
        <Toggle checked={system.twoFactor} onChange={v => setSystem(p => ({ ...p, twoFactor: v }))}
          label="Two-Factor Authentication" desc="Require OTP on login" />
        <Toggle checked={system.dataEncryption} onChange={v => setSystem(p => ({ ...p, dataEncryption: v }))}
          label="End-to-End Data Encryption" desc="AES-256 encryption for all data transmission" />

        <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <h4 className="font-display text-sm text-slate-300 tracking-wider mb-4">CHANGE PASSWORD</h4>
          <div className="space-y-3 max-w-sm">
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Current password"
                value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                className="cyber-input w-full px-3 py-2 rounded text-sm pr-10" />
              <button onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input type={showPw ? 'text' : 'password'} placeholder="New password"
              value={pwForm.new} onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))}
              className="cyber-input w-full px-3 py-2 rounded text-sm" />
            <input type={showPw ? 'text' : 'password'} placeholder="Confirm new password"
              value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              className="cyber-input w-full px-3 py-2 rounded text-sm" />
            <button onClick={changePassword} className="btn-primary px-5 py-2 rounded text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>

        {/* Session info */}
        <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <h4 className="font-display text-sm text-slate-300 tracking-wider mb-3">ACTIVE SESSION</h4>
          <div className="space-y-2">
            {[
              ['Session Started', new Date().toLocaleString()],
              ['IP Address', '192.168.1.105 (Internal)'],
              ['Browser', 'Chrome 120 · Windows 11'],
              ['Access Level', user?.role?.toUpperCase() || 'OFFICER'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs font-mono"
                style={{ borderColor: 'rgba(14,165,233,0.06)' }}>
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </SECTION>

      {/* Database */}
      <SECTION title="DATABASE & DATA MANAGEMENT" icon={Database}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'FIR Records', value: '1,284', color: '#0ea5e9' },
            { label: 'Suspect Profiles', value: '156', color: '#f59e0b' },
            { label: 'Evidence Files', value: '3,892', color: '#10b981' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded border text-center" style={{ borderColor: `${s.color}30`, background: `${s.color}08` }}>
              <div className="stat-number text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="font-mono text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => toast.success('Backup started...')}
            className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
            <Database className="w-4 h-4" /> Backup Database
          </button>
          <button onClick={() => toast.success('Data export initiated')}
            className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Export Reports
          </button>
          <button onClick={() => toast.success('Cache cleared')}
            className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Clear Cache
          </button>
        </div>
        <div className="mt-4 p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-slate-400">
              Last backup: <span className="text-yellow-400">3 days ago</span> — Backup recommended weekly for data integrity.
            </p>
          </div>
        </div>
      </SECTION>
    </div>
  );
}
