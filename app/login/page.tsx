'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import { Shield, Eye, EyeOff, AlertTriangle, Lock, User } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@cpis.gov', password: 'admin123', color: '#ef4444' },
  { role: 'Analyst', email: 'analyst@cpis.gov', password: 'analyst123', color: '#0ea5e9' },
  { role: 'Officer', email: 'officer@cpis.gov', password: 'officer123', color: '#10b981' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootText, setBootText] = useState('');
  const { setUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  useEffect(() => {
    const lines = [
      'CPIS v4.2.1 — Initializing secure environment...',
      'Loading biometric modules... OK',
      'Connecting to central database... OK',
      'AI prediction engine... ONLINE',
      'Facial recognition system... ONLINE',
      'Emergency alert system... STANDBY',
      '─────────────────────────────────────',
      'SYSTEM READY. Please authenticate.',
    ];
    let i = 0;
    let text = '';
    const interval = setInterval(() => {
      if (i < lines.length) {
        text += (i > 0 ? '\n' : '') + lines[i];
        setBootText(text);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));
    const session = login(email, password);

    if (session) {
      setUser(session);
      router.push('/dashboard');
    } else {
      setError('ACCESS DENIED — Invalid credentials. Authorization failed.');
      setLoading(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at top, #0d1424 0%, #050810 100%)' }}>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i}
            className="absolute w-px bg-brand-500 opacity-10"
            style={{
              left: `${(i * 5.2) % 100}%`,
              height: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl flex gap-6 relative z-10">

        {/* Left — Boot terminal */}
        <div className="hidden lg:flex flex-1 flex-col justify-between cyber-card rounded-lg p-6">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="font-display text-brand-400 text-xl tracking-widest">CPIS</div>
                <div className="text-xs text-slate-500 font-mono tracking-widest">CRIME PATTERN INTELLIGENCE</div>
              </div>
            </div>

            {/* Terminal */}
            <div className="bg-dark-900 rounded-lg p-4 border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-600 text-xs ml-2">secure_shell — cpis@central</span>
              </div>
              <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap cursor-blink">
                {bootText}
              </pre>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: 'Active Cases', value: '47', color: '#ef4444' },
              { label: 'AI Accuracy', value: '94.2%', color: '#10b981' },
              { label: 'Suspects Tracked', value: '156', color: '#f59e0b' },
              { label: 'Solution Rate', value: '69.5%', color: '#0ea5e9' },
            ].map(s => (
              <div key={s.label} className="bg-dark-700 rounded-lg p-3 border border-slate-800">
                <div className="font-display text-lg" style={{ color: s.color }}>{s.value}</div>
                <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login form */}
        <div className="flex-1 max-w-md w-full">
          <div className="cyber-card rounded-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 0 25px rgba(14,165,233,0.4)' }}>
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="font-display text-brand-400 text-2xl tracking-widest mb-1">AUTHENTICATE</div>
              <div className="text-slate-500 font-mono text-xs tracking-widest">AUTHORIZED PERSONNEL ONLY</div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="status-dot" />
                <span className="text-green-400 font-mono text-xs">SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded border border-red-500/30 bg-red-500/10 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 font-mono text-xs">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">
                  Credential ID / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@cpis.gov"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">
                  Security Passphrase
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="cyber-input w-full pl-10 pr-10 py-3 rounded"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 rounded font-display text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 mt-6">
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    AUTHENTICATE
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              <div className="relative flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-slate-600 font-mono text-xs">DEMO ACCESS</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.role} onClick={() => fillDemo(acc)}
                    className="w-full p-2.5 rounded border border-slate-800 hover:border-brand-500/50 flex items-center justify-between transition-all group">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: acc.color }} />
                      <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                        {acc.email}
                      </span>
                    </div>
                    <span className="badge" style={{
                      background: `${acc.color}20`, color: acc.color,
                      border: `1px solid ${acc.color}40`, fontSize: '0.6rem'
                    }}>
                      {acc.role.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-700 font-mono text-xs mt-4">
            CPIS © 2024 — CLASSIFIED SYSTEM — UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>
      </div>
    </div>
  );
}
