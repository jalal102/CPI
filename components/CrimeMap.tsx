'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CrimeRecord } from '@/lib/data';

const CRIME_COLORS: Record<string, string> = {
  robbery: '#f59e0b', assault: '#ef4444', fraud: '#8b5cf6',
  cybercrime: '#06b6d4', drug_trafficking: '#ec4899', homicide: '#dc2626',
  burglary: '#10b981', theft: '#6b7280', kidnapping: '#f97316', vandalism: '#84cc16',
};

const SEVERITY_RADIUS: Record<string, number> = {
  critical: 18, high: 14, medium: 10, low: 7,
};

function HeatLayer({ points }: { points: Array<{ lat: number; lng: number; intensity: number; label: string }> }) {
  return (
    <>
      {points.map((p, i) => (
        <CircleMarker key={`heat-${i}`}
          center={[p.lat, p.lng]}
          radius={p.intensity * 40}
          pathOptions={{
            color: p.intensity > 0.85 ? '#ef4444' : p.intensity > 0.7 ? '#f59e0b' : '#0ea5e9',
            fillColor: p.intensity > 0.85 ? '#ef4444' : p.intensity > 0.7 ? '#f59e0b' : '#0ea5e9',
            fillOpacity: p.intensity * 0.25,
            weight: 1,
            opacity: 0.5,
          }}>
          <Popup>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#e2e8f0' }}>
              <strong style={{ color: '#0ea5e9' }}>{p.label}</strong><br />
              Risk: {Math.round(p.intensity * 100)}%
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

interface Props {
  crimes: CrimeRecord[];
  heatPoints: Array<{ lat: number; lng: number; intensity: number; label: string }>;
  showHeat: boolean;
  showMarkers: boolean;
}

export function CrimeMap({ crimes, heatPoints, showHeat, showMarkers }: Props) {
  const center: [number, number] = [33.738, 72.981];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', background: '#050810' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showHeat && <HeatLayer points={heatPoints} />}

      {showMarkers && crimes.map(crime => (
        <CircleMarker
          key={crime.id}
          center={[crime.location.lat, crime.location.lng]}
          radius={SEVERITY_RADIUS[crime.severity] || 10}
          pathOptions={{
            color: CRIME_COLORS[crime.type] || '#6b7280',
            fillColor: CRIME_COLORS[crime.type] || '#6b7280',
            fillOpacity: 0.8,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#e2e8f0', minWidth: '200px' }}>
              <div style={{ color: '#0ea5e9', fontWeight: 'bold', marginBottom: 4 }}>{crime.firNumber}</div>
              <div><strong>Type:</strong> {crime.type.replace('_', ' ').toUpperCase()}</div>
              <div><strong>Date:</strong> {crime.date} {crime.time}</div>
              <div><strong>Location:</strong> {crime.location.address}</div>
              <div style={{ marginTop: 4 }}>
                <span style={{
                  background: crime.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                  color: crime.severity === 'critical' ? '#ef4444' : '#f59e0b',
                  padding: '1px 6px', borderRadius: 2, fontSize: 10,
                }}>
                  {crime.severity.toUpperCase()}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 10, color: '#64748b' }}>{crime.description.slice(0, 80)}...</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
