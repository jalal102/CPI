'use client';

import { useState, useEffect } from 'react';
import { MOCK_CRIMES, HEAT_POINTS } from '@/lib/data';
import { MapPin, Layers, Filter, AlertTriangle, Eye, Navigation } from 'lucide-react';

const CRIME_COLORS: Record<string, string> = {
  robbery: '#f59e0b', assault: '#ef4444', fraud: '#8b5cf6',
  cybercrime: '#06b6d4', drug_trafficking: '#ec4899', homicide: '#dc2626',
  burglary: '#10b981', theft: '#6b7280', kidnapping: '#f97316', vandalism: '#84cc16',
};

export default function HeatmapPage() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showHeat, setShowHeat] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    const loadMap = async () => {
      const { CrimeMap } = await import('@/components/CrimeMap');
      setMapComponent(() => CrimeMap);
    };
    loadMap();
  }, []);

  const filteredCrimes = selectedFilter === 'all'
    ? MOCK_CRIMES
    : MOCK_CRIMES.filter(c => c.type === selectedFilter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400 tracking-wider">GEOSPATIAL INTELLIGENCE</span>
          </div>
          <h1 className="font-display text-xl text-slate-100 tracking-wider">CRIME HEATMAP & TRACKING</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">Live crime data overlay · Peshawar Metropolitan Area</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded border border-green-500/20 bg-green-500/5">
          <div className="status-dot" />
          <span className="text-green-400 font-mono text-xs">LIVE TRACKING</span>
        </div>
      </div>

      {/* Controls */}
      <div className="cyber-card rounded-lg p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-mono text-xs text-slate-400">FILTER:</span>
        </div>
        <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}
          className="cyber-input px-3 py-1.5 rounded text-sm">
          <option value="all">All Crime Types</option>
          {Object.keys(CRIME_COLORS).map(t => (
            <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>

        <div className="flex items-center gap-3 ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showHeat} onChange={e => setShowHeat(e.target.checked)}
              className="w-3 h-3 accent-brand-400" />
            <span className="font-mono text-xs text-slate-400">Heat Layer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showMarkers} onChange={e => setShowMarkers(e.target.checked)}
              className="w-3 h-3 accent-brand-400" />
            <span className="font-mono text-xs text-slate-400">Crime Markers</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 cyber-card rounded-lg overflow-hidden" style={{ height: '520px' }}>
          {MapComponent ? (
            <MapComponent
              crimes={filteredCrimes}
              heatPoints={HEAT_POINTS}
              showHeat={showHeat}
              showMarkers={showMarkers}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="spinner w-8 h-8 mx-auto mb-3" />
                <p className="font-mono text-sm text-brand-400">LOADING MAP...</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-3">
          {/* Legend */}
          <div className="cyber-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-brand-400" />
              <h3 className="font-display text-xs text-slate-200 tracking-wider">LEGEND</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(CRIME_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: color, background: `${color}30` }} />
                  <span className="text-xs font-mono text-slate-400 capitalize">{type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Heat Risk Zones */}
          <div className="cyber-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-display text-xs text-slate-200 tracking-wider">RISK ZONES</h3>
            </div>
            <div className="space-y-2">
              {HEAT_POINTS.filter(h => h.intensity > 0.7).slice(0, 5).map((h, i) => (
                <div key={i} className="p-2 rounded" style={{
                  background: `rgba(${h.intensity > 0.85 ? '239,68,68' : '245,158,11'},0.1)`,
                  borderLeft: `2px solid ${h.intensity > 0.85 ? '#ef4444' : '#f59e0b'}`,
                }}>
                  <div className="font-mono text-xs text-slate-300">{h.label}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="progress-bar flex-1">
                      <div className="progress-fill" style={{
                        width: `${h.intensity * 100}%`,
                        background: h.intensity > 0.85 ? '#ef4444' : '#f59e0b',
                      }} />
                    </div>
                    <span className="font-mono text-xs" style={{ color: h.intensity > 0.85 ? '#ef4444' : '#f59e0b' }}>
                      {Math.round(h.intensity * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="cyber-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-brand-400" />
              <h3 className="font-display text-xs text-slate-200 tracking-wider">MAP STATS</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Plotted Crimes', value: filteredCrimes.length },
                { label: 'Hot Zones', value: HEAT_POINTS.filter(h => h.intensity > 0.7).length },
                { label: 'Critical Areas', value: HEAT_POINTS.filter(h => h.intensity > 0.85).length },
                { label: 'Coverage Radius', value: '45 km' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="font-mono text-xs text-slate-500">{s.label}</span>
                  <span className="font-mono text-xs text-brand-400 font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crime List */}
      <div className="cyber-card rounded-lg overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
          <Navigation className="w-4 h-4 text-brand-400" />
          <h3 className="font-display text-sm text-slate-200 tracking-wider">PLOTTED CRIME INCIDENTS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="intel-table w-full">
            <thead>
              <tr>
                <th className="text-left">FIR No.</th>
                <th className="text-left">Type</th>
                <th className="text-left">Date</th>
                <th className="text-left">Location</th>
                <th className="text-left">Severity</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrimes.map(c => (
                <tr key={c.id}>
                  <td className="text-brand-400">{c.firNumber}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: CRIME_COLORS[c.type] || '#6b7280' }} />
                      <span className="capitalize">{c.type.replace('_',' ')}</span>
                    </div>
                  </td>
                  <td>{c.date}</td>
                  <td className="text-slate-400 max-w-[200px] truncate">{c.location.address}</td>
                  <td><span className={`badge badge-${c.severity}`}>{c.severity.toUpperCase()}</span></td>
                  <td><span className={`badge badge-${c.status}`}>{c.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
