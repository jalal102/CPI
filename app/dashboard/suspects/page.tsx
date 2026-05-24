'use client';

import { useState, useRef } from 'react';
import { MOCK_SUSPECTS, Suspect } from '@/lib/data';
import toast from 'react-hot-toast';
import {
  Users, Search, ScanFace, Camera, X, Eye, AlertTriangle,
  MapPin, Calendar, Shield, Fingerprint, Plus, Download
} from 'lucide-react';
import Image from 'next/image';

const THREAT_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#10b981',
};

export default function SuspectsPage() {
  const [suspects, setSuspects] = useState<Suspect[]>(MOCK_SUSPECTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [selected, setSelected] = useState<Suspect | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Suspect | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSuspect, setNewSuspect] = useState<Partial<Suspect>>({
    name: '', alias: '', age: 0, gender: 'Male',
    threatLevel: 'medium', status: 'wanted',
    lastSeen: new Date().toISOString().split('T')[0],
    location: '', crimes: [],
  });

  const filtered = suspects.filter(s => {
    const matchSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.alias && s.alias.toLowerCase().includes(search.toLowerCase())) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchThreat = threatFilter === 'all' || s.threatLevel === threatFilter;
    return matchSearch && matchStatus && matchThreat;
  });

  const runFacialScan = () => {
    setShowScanModal(true);
    setScanning(true);
    setScanResult(null);
    // Simulate AI facial recognition
    setTimeout(() => {
      setScanning(false);
      const wanted = suspects.filter(s => s.status === 'wanted');
      const match = wanted[Math.floor(Math.random() * wanted.length)];
      setScanResult(match);
      toast.error(`⚠ MATCH FOUND: ${match.name} (${match.alias || 'No alias'})`);
    }, 3000);
  };

  const addSuspect = () => {
    if (!newSuspect.name || !newSuspect.location) {
      toast.error('Name and location are required');
      return;
    }
    const s: Suspect = {
      id: `s${Date.now()}`,
      name: newSuspect.name!,
      alias: newSuspect.alias || undefined,
      age: newSuspect.age || 0,
      gender: newSuspect.gender || 'Male',
      threatLevel: newSuspect.threatLevel as any || 'medium',
      status: newSuspect.status as any || 'wanted',
      lastSeen: newSuspect.lastSeen || '',
      location: newSuspect.location!,
      crimes: [],
      image: `https://randomuser.me/api/portraits/${newSuspect.gender === 'Female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg`,
    };
    setSuspects(prev => [s, ...prev]);
    setShowAddModal(false);
    toast.success('Suspect profile added to database');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400 tracking-wider">SUSPECT DATABASE</span>
          </div>
          <h1 className="font-display text-xl text-slate-100 tracking-wider">SUSPECT PROFILES & FACIAL RECOGNITION</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            {suspects.length} profiles · {suspects.filter(s => s.status === 'wanted').length} wanted · AI-powered identification
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={runFacialScan}
            className="px-4 py-2 rounded text-sm flex items-center gap-2 font-display tracking-wider transition-all"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}>
            <ScanFace className="w-4 h-4" /> FACIAL SCAN
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2 rounded text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Suspect
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Wanted', value: suspects.filter(s => s.status === 'wanted').length, color: '#ef4444' },
          { label: 'Arrested', value: suspects.filter(s => s.status === 'arrested').length, color: '#10b981' },
          { label: 'Critical Threat', value: suspects.filter(s => s.threatLevel === 'critical').length, color: '#ef4444' },
          { label: 'High Threat', value: suspects.filter(s => s.threatLevel === 'high').length, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="cyber-card rounded-lg p-4">
            <div className="stat-number text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-slate-500 font-mono text-xs uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="cyber-card rounded-lg p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search name, alias, location..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="cyber-input w-full pl-9 pr-4 py-2 rounded text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="cyber-input px-3 py-2 rounded text-sm">
          <option value="all">All Status</option>
          <option value="wanted">Wanted</option>
          <option value="arrested">Arrested</option>
          <option value="released">Released</option>
          <option value="deceased">Deceased</option>
        </select>
        <select value={threatFilter} onChange={e => setThreatFilter(e.target.value)}
          className="cyber-input px-3 py-2 rounded text-sm">
          <option value="all">All Threat Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Suspect Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const tc = THREAT_COLORS[s.threatLevel] || '#6b7280';
          return (
            <div key={s.id} className="cyber-card rounded-lg overflow-hidden hover:glow-border transition-all cursor-pointer group"
              onClick={() => setSelected(s)}>
              {/* Top threat bar */}
              <div className="h-1" style={{ background: tc }} />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Photo */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2" style={{ borderColor: tc }}>
                      {s.image ? (
                        <img src={s.image} alt={s.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMxMTIyMzMiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjI0IiByPSIxMCIgZmlsbD0iIzMzNDQ1NSIvPjxwYXRoIGQ9Ik0xMCA1NmMwLTEyIDEwLTIyIDIyLTIyczIyIDEwIDIyIDIyIiBmaWxsPSIjMzM0NDU1Ii8+PC9zdmc+'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-500">
                          <Users className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                    </div>
                    {s.status === 'wanted' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border border-dark-700" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm text-slate-100 tracking-wide truncate group-hover:text-brand-400 transition-colors">
                      {s.name}
                    </div>
                    {s.alias && (
                      <div className="font-mono text-xs text-slate-500 mb-1">"{s.alias}"</div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge badge-${s.threatLevel}`}>
                        {s.threatLevel.toUpperCase()}
                      </span>
                      <span className={`badge ${s.status === 'wanted' ? 'badge-open' : s.status === 'arrested' ? 'badge-solved' : 'badge-pending'}`}>
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: 'rgba(14,165,233,0.08)' }}>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{s.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3 h-3 shrink-0" />
                    Last seen: {s.lastSeen}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Shield className="w-3 h-3 shrink-0" />
                    {s.crimes.length} linked crime{s.crimes.length !== 1 ? 's' : ''} · Age {s.age}
                  </div>
                </div>

                <button className="mt-3 w-full py-1.5 rounded border text-xs font-mono tracking-wider transition-all"
                  style={{ borderColor: `${tc}40`, color: tc, background: `${tc}10` }}>
                  VIEW FULL PROFILE →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 cyber-card rounded-lg">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-display text-lg text-slate-500 tracking-wider">NO SUSPECTS FOUND</p>
          <p className="font-mono text-sm text-slate-700 mt-1">Try adjusting your search filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-content p-0 overflow-hidden max-w-2xl">
            {/* Header */}
            <div className="relative h-24 flex items-end p-5"
              style={{ background: `linear-gradient(135deg, ${THREAT_COLORS[selected.threatLevel]}30, transparent)` }}>
              <div className="absolute inset-0" style={{ borderBottom: `2px solid ${THREAT_COLORS[selected.threatLevel]}40` }} />
              <div className="flex items-end gap-4 relative">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2"
                  style={{ borderColor: THREAT_COLORS[selected.threatLevel] }}>
                  {selected.image ? (
                    <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-500 flex items-center justify-center">
                      <Users className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-xl text-slate-100 tracking-wider">{selected.name}</h2>
                  {selected.alias && <p className="font-mono text-sm text-slate-400">"{selected.alias}"</p>}
                  <div className="flex gap-2 mt-1">
                    <span className={`badge badge-${selected.threatLevel}`}>{selected.threatLevel.toUpperCase()} THREAT</span>
                    <span className={`badge ${selected.status === 'wanted' ? 'badge-open' : 'badge-solved'}`}>{selected.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Age', `${selected.age} years`],
                  ['Gender', selected.gender],
                  ['Last Seen', selected.lastSeen],
                  ['Known Location', selected.location],
                  ['Linked Crimes', `${selected.crimes.length} cases`],
                  ['Suspect ID', selected.id.toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">{k}</div>
                    <div className="font-mono text-sm text-slate-200">{v}</div>
                  </div>
                ))}
              </div>

              {/* AI Threat Assessment */}
              <div className="p-4 rounded border" style={{
                borderColor: `${THREAT_COLORS[selected.threatLevel]}30`,
                background: `${THREAT_COLORS[selected.threatLevel]}08`,
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className="w-4 h-4" style={{ color: THREAT_COLORS[selected.threatLevel] }} />
                  <span className="font-display text-xs tracking-wider" style={{ color: THREAT_COLORS[selected.threatLevel] }}>
                    AI THREAT ASSESSMENT
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-mono leading-relaxed">
                  {selected.threatLevel === 'critical'
                    ? 'EXTREME DANGER: Do not approach without armed backup. Subject is known to be violent and heavily armed. Immediate arrest priority.'
                    : selected.threatLevel === 'high'
                    ? 'HIGH RISK: Approach with caution. Subject has history of violence. Minimum 2 officers required for apprehension.'
                    : 'MODERATE RISK: Standard protocol applies. Subject may flee. Backup recommended.'}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                    <span>Threat Score</span>
                    <span style={{ color: THREAT_COLORS[selected.threatLevel] }}>
                      {selected.threatLevel === 'critical' ? '95' : selected.threatLevel === 'high' ? '78' : '52'}/100
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${selected.threatLevel === 'critical' ? 95 : selected.threatLevel === 'high' ? 78 : 52}%`,
                      background: THREAT_COLORS[selected.threatLevel],
                    }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setSelected(null); toast.success(`APB issued for ${selected.name}`); }}
                  className="btn-danger flex-1 py-2.5 rounded text-sm font-display tracking-wider">
                  ISSUE APB
                </button>
                <button onClick={() => setSelected(null)} className="btn-ghost flex-1 py-2.5 rounded text-sm">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facial Recognition Modal */}
      {showScanModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowScanModal(false)}>
          <div className="modal-content p-6 max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-brand-400" />
                <h2 className="font-display text-lg text-slate-100 tracking-wider">FACIAL RECOGNITION</h2>
              </div>
              <button onClick={() => setShowScanModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera feed simulation */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-dark-900 border border-brand-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                {scanning ? (
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      {/* Face outline */}
                      <div className="absolute inset-0 border-2 border-brand-400/50 rounded-full" />
                      {/* Scan line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-brand-400/80"
                        style={{ animation: 'scan 1.5s linear infinite', top: '50%' }} />
                      <Camera className="absolute inset-0 m-auto w-12 h-12 text-brand-400/30" />
                    </div>
                    <p className="font-mono text-xs text-brand-400 animate-pulse">SCANNING... COMPARING DATABASE</p>
                    <p className="font-mono text-xs text-slate-600 mt-1">AI processing {suspects.length} profiles</p>
                  </div>
                ) : scanResult ? (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-400 mx-auto mb-2">
                      {scanResult.image && <img src={scanResult.image} alt={scanResult.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="font-display text-red-400 text-lg tracking-wider mb-1">⚠ MATCH FOUND</div>
                    <div className="font-bold text-slate-100">{scanResult.name}</div>
                    {scanResult.alias && <div className="text-slate-400 text-sm">"{scanResult.alias}"</div>}
                    <div className="flex justify-center gap-2 mt-2">
                      <span className={`badge badge-${scanResult.threatLevel}`}>{scanResult.threatLevel.toUpperCase()}</span>
                      <span className="badge badge-open">{scanResult.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                      <p className="font-mono text-xs text-red-400">CONFIDENCE: 97.3% · IMMEDIATE ACTION REQUIRED</p>
                    </div>
                  </div>
                ) : null}
              </div>
              {/* Corner indicators */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-5 h-5 border-brand-400`}
                  style={{
                    borderTop: i < 2 ? '2px solid' : 'none',
                    borderBottom: i >= 2 ? '2px solid' : 'none',
                    borderLeft: i % 2 === 0 ? '2px solid' : 'none',
                    borderRight: i % 2 === 1 ? '2px solid' : 'none',
                    borderColor: '#0ea5e9',
                  }} />
              ))}
            </div>

            <div className="flex gap-3">
              {!scanning && !scanResult && (
                <button onClick={runFacialScan} className="btn-primary flex-1 py-2.5 rounded text-sm font-display tracking-wider">
                  START SCAN
                </button>
              )}
              {scanResult && (
                <button onClick={() => { setSelected(scanResult); setShowScanModal(false); }}
                  className="btn-danger flex-1 py-2.5 rounded text-sm font-display tracking-wider">
                  VIEW PROFILE
                </button>
              )}
              <button onClick={() => { setShowScanModal(false); setScanResult(null); }}
                className="btn-ghost flex-1 py-2.5 rounded text-sm">
                {scanResult ? 'CLOSE' : 'CANCEL'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Suspect Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-content p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg text-slate-100 tracking-wider">ADD SUSPECT PROFILE</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Full Name *</label>
                <input value={newSuspect.name} onChange={e => setNewSuspect(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full legal name" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Alias / Nickname</label>
                <input value={newSuspect.alias || ''} onChange={e => setNewSuspect(p => ({ ...p, alias: e.target.value }))}
                  placeholder="Street name or alias" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Age</label>
                <input type="number" value={newSuspect.age || ''} onChange={e => setNewSuspect(p => ({ ...p, age: +e.target.value }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Gender</label>
                <select value={newSuspect.gender} onChange={e => setNewSuspect(p => ({ ...p, gender: e.target.value }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Threat Level</label>
                <select value={newSuspect.threatLevel} onChange={e => setNewSuspect(p => ({ ...p, threatLevel: e.target.value as any }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Status</label>
                <select value={newSuspect.status} onChange={e => setNewSuspect(p => ({ ...p, status: e.target.value as any }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  <option value="wanted">WANTED</option>
                  <option value="arrested">ARRESTED</option>
                  <option value="released">RELEASED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Last Seen Date</label>
                <input type="date" value={newSuspect.lastSeen} onChange={e => setNewSuspect(p => ({ ...p, lastSeen: e.target.value }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Known Location *</label>
                <input value={newSuspect.location} onChange={e => setNewSuspect(p => ({ ...p, location: e.target.value }))}
                  placeholder="Last known address" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="btn-ghost flex-1 py-2.5 rounded text-sm">CANCEL</button>
              <button onClick={addSuspect} className="btn-primary flex-1 py-2.5 rounded text-sm font-display tracking-wider">
                ADD TO DATABASE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
