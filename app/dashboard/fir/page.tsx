'use client';

import { useState } from 'react';
import { MOCK_FIRS, MOCK_CRIMES } from '@/lib/data';
import { FIR, CrimeType } from '@/lib/data';
import toast from 'react-hot-toast';
import {
  FileText, Plus, Search, Filter, Download, Eye,
  Edit, Trash2, X, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CRIME_TYPES: CrimeType[] = [
  'robbery','assault','burglary','fraud','homicide',
  'drug_trafficking','cybercrime','kidnapping','vandalism','theft'
];

const emptyFIR = (): Partial<FIR> => ({
  firNumber: `FIR-2024-${String(Math.floor(Math.random() * 9000 + 1000))}`,
  complainant: '',
  phone: '',
  crimeType: 'theft',
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: '',
  status: 'open',
  assignedOfficer: '',
  priority: 'medium',
  evidence: [],
  createdAt: new Date().toISOString(),
});

export default function FIRPage() {
  const [firs, setFirs] = useState<FIR[]>(MOCK_FIRS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editFIR, setEditFIR] = useState<Partial<FIR>>(emptyFIR());
  const [editId, setEditId] = useState<string | null>(null);
  const [viewFIR, setViewFIR] = useState<FIR | null>(null);

  const filtered = firs.filter(f => {
    const matchSearch = search === '' ||
      f.firNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.complainant.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || f.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const openNew = () => {
    setEditFIR(emptyFIR());
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (fir: FIR) => {
    setEditFIR({ ...fir });
    setEditId(fir.id);
    setShowModal(true);
  };

  const saveFIR = () => {
    if (!editFIR.complainant || !editFIR.location || !editFIR.description) {
      toast.error('Please fill all required fields');
      return;
    }
    if (editId) {
      setFirs(prev => prev.map(f => f.id === editId ? { ...f, ...editFIR } as FIR : f));
      toast.success('FIR updated successfully');
    } else {
      const newFIR: FIR = { id: uuidv4(), ...editFIR } as FIR;
      setFirs(prev => [newFIR, ...prev]);
      toast.success('FIR registered successfully');
    }
    setShowModal(false);
  };

  const deleteFIR = (id: string) => {
    setFirs(prev => prev.filter(f => f.id !== id));
    toast.success('FIR deleted');
  };

  const exportCSV = () => {
    const headers = ['FIR No,Complainant,Type,Date,Location,Status,Priority,Officer'];
    const rows = filtered.map(f =>
      `${f.firNumber},${f.complainant},${f.crimeType},${f.date},${f.location},${f.status},${f.priority},${f.assignedOfficer}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'fir_records.csv'; a.click();
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs text-brand-400 tracking-wider">FIR MANAGEMENT</span>
          </div>
          <h1 className="font-display text-xl text-slate-100 tracking-wider">FIRST INFORMATION REPORTS</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">{firs.length} total records · {firs.filter(f => f.status === 'open').length} open</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={openNew} className="btn-primary px-4 py-2 rounded text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New FIR
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="cyber-card rounded-lg p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="Search FIR number, complainant, location..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="cyber-input w-full pl-9 pr-4 py-2 rounded text-sm"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="cyber-input px-3 py-2 rounded text-sm">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="solved">Solved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="cyber-input px-3 py-2 rounded text-sm">
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open', count: firs.filter(f => f.status === 'open').length, color: '#ef4444', icon: AlertCircle },
          { label: 'Investigating', count: firs.filter(f => f.status === 'investigating').length, color: '#f59e0b', icon: Clock },
          { label: 'Solved', count: firs.filter(f => f.status === 'solved').length, color: '#10b981', icon: CheckCircle },
          { label: 'Critical', count: firs.filter(f => f.priority === 'critical').length, color: '#0ea5e9', icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="cyber-card rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="stat-number text-xl font-bold" style={{ color: s.color }}>{s.count}</div>
              <div className="text-slate-500 font-mono text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="cyber-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="intel-table w-full">
            <thead>
              <tr>
                <th className="text-left">FIR No.</th>
                <th className="text-left">Complainant</th>
                <th className="text-left">Crime Type</th>
                <th className="text-left">Date</th>
                <th className="text-left">Location</th>
                <th className="text-left">Officer</th>
                <th className="text-left">Priority</th>
                <th className="text-left">Status</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td className="text-brand-400 font-bold">{f.firNumber}</td>
                  <td className="text-slate-300">{f.complainant}</td>
                  <td className="capitalize">{f.crimeType.replace('_', ' ')}</td>
                  <td>{f.date}</td>
                  <td className="text-slate-400 max-w-[150px] truncate">{f.location}</td>
                  <td className="text-slate-400">{f.assignedOfficer}</td>
                  <td><span className={`badge badge-${f.priority}`}>{f.priority.toUpperCase()}</span></td>
                  <td><span className={`badge badge-${f.status}`}>{f.status.toUpperCase()}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewFIR(f)} className="text-slate-500 hover:text-brand-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(f)} className="text-slate-500 hover:text-yellow-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteFIR(f.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600 font-mono text-sm">
              No FIR records match your search
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-slate-100 tracking-wider">
                {editId ? 'EDIT FIR RECORD' : 'REGISTER NEW FIR'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">FIR Number</label>
                <input value={editFIR.firNumber || ''} readOnly className="cyber-input w-full px-3 py-2 rounded text-sm opacity-60" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Date *</label>
                <input type="date" value={editFIR.date || ''} onChange={e => setEditFIR(p => ({ ...p, date: e.target.value }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Complainant Name *</label>
                <input value={editFIR.complainant || ''} onChange={e => setEditFIR(p => ({ ...p, complainant: e.target.value }))}
                  placeholder="Full name" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Phone</label>
                <input value={editFIR.phone || ''} onChange={e => setEditFIR(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+92-..." className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Crime Type *</label>
                <select value={editFIR.crimeType} onChange={e => setEditFIR(p => ({ ...p, crimeType: e.target.value as CrimeType }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  {CRIME_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Priority</label>
                <select value={editFIR.priority} onChange={e => setEditFIR(p => ({ ...p, priority: e.target.value as any }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Location *</label>
                <input value={editFIR.location || ''} onChange={e => setEditFIR(p => ({ ...p, location: e.target.value }))}
                  placeholder="Full address" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Assigned Officer</label>
                <input value={editFIR.assignedOfficer || ''} onChange={e => setEditFIR(p => ({ ...p, assignedOfficer: e.target.value }))}
                  placeholder="Officer name" className="cyber-input w-full px-3 py-2 rounded text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Status</label>
                <select value={editFIR.status} onChange={e => setEditFIR(p => ({ ...p, status: e.target.value as any }))}
                  className="cyber-input w-full px-3 py-2 rounded text-sm">
                  <option value="open">OPEN</option>
                  <option value="investigating">INVESTIGATING</option>
                  <option value="solved">SOLVED</option>
                  <option value="closed">CLOSED</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Description *</label>
                <textarea value={editFIR.description || ''} onChange={e => setEditFIR(p => ({ ...p, description: e.target.value }))}
                  rows={4} placeholder="Detailed description of the incident..."
                  className="cyber-input w-full px-3 py-2 rounded text-sm resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1 py-2.5 rounded text-sm">CANCEL</button>
              <button onClick={saveFIR} className="btn-primary flex-1 py-2.5 rounded text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {editId ? 'UPDATE FIR' : 'REGISTER FIR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewFIR && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewFIR(null)}>
          <div className="modal-content p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg text-brand-400 tracking-wider">{viewFIR.firNumber}</h2>
                <p className="text-slate-500 font-mono text-xs">{viewFIR.date} · {viewFIR.location}</p>
              </div>
              <button onClick={() => setViewFIR(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ['Complainant', viewFIR.complainant],
                ['Phone', viewFIR.phone],
                ['Crime Type', viewFIR.crimeType.replace('_', ' ').toUpperCase()],
                ['Location', viewFIR.location],
                ['Assigned Officer', viewFIR.assignedOfficer],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-3">
                  <div className="font-mono text-xs text-slate-500 uppercase w-28 shrink-0 pt-0.5">{k}</div>
                  <div className="font-mono text-sm text-slate-200">{v}</div>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs text-slate-500 uppercase w-28 shrink-0 pt-0.5">Status</div>
                <span className={`badge badge-${viewFIR.status}`}>{viewFIR.status.toUpperCase()}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs text-slate-500 uppercase w-28 shrink-0 pt-0.5">Priority</div>
                <span className={`badge badge-${viewFIR.priority}`}>{viewFIR.priority.toUpperCase()}</span>
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
                <div className="font-mono text-xs text-slate-500 uppercase mb-2">Description</div>
                <p className="text-slate-300 text-sm leading-relaxed">{viewFIR.description}</p>
              </div>
              {viewFIR.evidence.length > 0 && (
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase mb-2">Evidence</div>
                  <div className="flex flex-wrap gap-2">
                    {viewFIR.evidence.map(e => (
                      <span key={e} className="badge badge-medium">{e}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
