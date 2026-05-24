// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'officer';
  badge: string;
  department: string;
  avatar?: string;
}

export interface CrimeRecord {
  id: string;
  firNumber: string;
  type: CrimeType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'solved' | 'closed';
  location: { lat: number; lng: number; address: string };
  date: string;
  time: string;
  description: string;
  suspectId?: string;
  officerId: string;
  witnesses: number;
  evidence: string[];
}

export interface Suspect {
  id: string;
  name: string;
  alias?: string;
  age: number;
  gender: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  crimes: string[];
  lastSeen: string;
  location: string;
  status: 'wanted' | 'arrested' | 'released' | 'deceased';
  image?: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface FIR {
  id: string;
  firNumber: string;
  complainant: string;
  phone: string;
  crimeType: CrimeType;
  date: string;
  location: string;
  description: string;
  status: 'open' | 'investigating' | 'solved' | 'closed';
  assignedOfficer: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidence: string[];
  createdAt: string;
}

export type CrimeType =
  | 'robbery'
  | 'assault'
  | 'burglary'
  | 'fraud'
  | 'homicide'
  | 'drug_trafficking'
  | 'cybercrime'
  | 'kidnapping'
  | 'vandalism'
  | 'theft';

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Cmdr. Hassan Ali',
    email: 'admin@cpis.gov',
    role: 'admin',
    badge: 'ADM-001',
    department: 'Central Command',
  },
  {
    id: 'u2',
    name: 'Analyst Zara Khan',
    email: 'analyst@cpis.gov',
    role: 'analyst',
    badge: 'ANL-042',
    department: 'Crime Analytics',
  },
  {
    id: 'u3',
    name: 'Officer Bilal Shah',
    email: 'officer@cpis.gov',
    role: 'officer',
    badge: 'OFF-117',
    department: 'Field Operations',
  },
];

// ─── Mock Crime Data ──────────────────────────────────────────────────────────

export const MOCK_CRIMES: CrimeRecord[] = [
  {
    id: 'c1', firNumber: 'FIR-2024-0891', type: 'robbery', severity: 'critical',
    status: 'investigating', date: '2024-11-15', time: '23:45',
    location: { lat: 33.738, lng: 72.981, address: 'Bank Road, Peshawar' },
    description: 'Armed robbery at National Bank branch. 3 suspects with firearms.',
    suspectId: 's1', officerId: 'u3', witnesses: 4,
    evidence: ['CCTV Footage', 'Fingerprints', 'Witness Statements'],
  },
  {
    id: 'c2', firNumber: 'FIR-2024-0887', type: 'assault', severity: 'high',
    status: 'open', date: '2024-11-14', time: '21:30',
    location: { lat: 33.745, lng: 72.990, address: 'Saddar Bazaar, Peshawar' },
    description: 'Physical assault resulting in serious injuries. Gang related.',
    suspectId: 's2', officerId: 'u3', witnesses: 2,
    evidence: ['Medical Report', 'Photos'],
  },
  {
    id: 'c3', firNumber: 'FIR-2024-0880', type: 'cybercrime', severity: 'high',
    status: 'investigating', date: '2024-11-13', time: '14:00',
    location: { lat: 33.750, lng: 72.970, address: 'IT Zone, Hayatabad',  },
    description: 'Large-scale phishing operation targeting banking customers.',
    officerId: 'u2', witnesses: 0,
    evidence: ['Server Logs', 'IP Traces', 'Email Headers'],
  },
  {
    id: 'c4', firNumber: 'FIR-2024-0875', type: 'drug_trafficking', severity: 'critical',
    status: 'investigating', date: '2024-11-12', time: '03:15',
    location: { lat: 33.720, lng: 72.965, address: 'GT Road, Nowshera' },
    description: 'Intercepted drug shipment. 50kg heroin seized. 2 arrested.',
    suspectId: 's3', officerId: 'u3', witnesses: 0,
    evidence: ['Drug Samples', 'Vehicle', 'Cash'],
  },
  {
    id: 'c5', firNumber: 'FIR-2024-0868', type: 'homicide', severity: 'critical',
    status: 'open', date: '2024-11-10', time: '01:30',
    location: { lat: 33.762, lng: 72.995, address: 'Phase 5, Hayatabad' },
    description: 'Unidentified body found. Gunshot wounds. No witnesses.',
    officerId: 'u3', witnesses: 0,
    evidence: ['Forensic Report', 'Ballistic Analysis'],
  },
  {
    id: 'c6', firNumber: 'FIR-2024-0855', type: 'burglary', severity: 'medium',
    status: 'solved', date: '2024-11-08', time: '04:30',
    location: { lat: 33.732, lng: 72.985, address: 'University Road, Peshawar' },
    description: 'Residential burglary. Jewelry and electronics stolen.',
    suspectId: 's4', officerId: 'u3', witnesses: 1,
    evidence: ['Fingerprints', 'CCTV', 'Recovered Items'],
  },
  {
    id: 'c7', firNumber: 'FIR-2024-0841', type: 'fraud', severity: 'medium',
    status: 'investigating', date: '2024-11-05', time: '10:00',
    location: { lat: 33.756, lng: 72.976, address: 'Gulbahar, Peshawar' },
    description: 'Real estate fraud. Multiple victims. Estimated loss: 5M PKR.',
    suspectId: 's5', officerId: 'u2', witnesses: 8,
    evidence: ['Documents', 'Bank Records', 'Victim Statements'],
  },
  {
    id: 'c8', firNumber: 'FIR-2024-0830', type: 'kidnapping', severity: 'critical',
    status: 'solved', date: '2024-11-01', time: '16:20',
    location: { lat: 33.740, lng: 72.960, address: 'Charsadda Road, Peshawar' },
    description: 'Child kidnapping for ransom. Victim recovered safely.',
    suspectId: 's1', officerId: 'u3', witnesses: 3,
    evidence: ['Ransom Call Recording', 'Vehicle Tracking', 'Suspect Arrested'],
  },
];

// ─── Mock Suspects ────────────────────────────────────────────────────────────

export const MOCK_SUSPECTS: Suspect[] = [
  {
    id: 's1', name: 'Rashid Mehmood', alias: 'The Ghost', age: 34, gender: 'Male',
    threatLevel: 'critical', crimes: ['c1', 'c8'], lastSeen: '2024-11-15',
    location: 'Unknown - Last seen Peshawar', status: 'wanted',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 's2', name: 'Kamran Wazir', alias: 'K-Dog', age: 28, gender: 'Male',
    threatLevel: 'high', crimes: ['c2'], lastSeen: '2024-11-14',
    location: 'Saddar, Peshawar', status: 'arrested',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 's3', name: 'Malik Dost', alias: 'The Trader', age: 45, gender: 'Male',
    threatLevel: 'critical', crimes: ['c4'], lastSeen: '2024-11-12',
    location: 'Nowshera', status: 'arrested',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 's4', name: 'Asad Khan', alias: null, age: 22, gender: 'Male',
    threatLevel: 'medium', crimes: ['c6'], lastSeen: '2024-11-08',
    location: 'Detained - Central Jail', status: 'arrested',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: 's5', name: 'Sajida Bibi', alias: 'Mama Bear', age: 52, gender: 'Female',
    threatLevel: 'high', crimes: ['c7'], lastSeen: '2024-11-05',
    location: 'Gulbahar, Peshawar', status: 'wanted',
    image: 'https://randomuser.me/api/portraits/women/41.jpg',
  },
];

// ─── Mock Alerts ──────────────────────────────────────────────────────────────

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1', type: 'critical', title: 'ARMED SUSPECT AT LARGE',
    message: 'Suspect Rashid Mehmood (alias: The Ghost) reported near Ring Road checkpoint. Armed and dangerous.',
    location: 'Ring Road, Peshawar', timestamp: '2024-11-15T23:58:00', acknowledged: false,
  },
  {
    id: 'a2', type: 'critical', title: 'GANG ACTIVITY DETECTED',
    message: 'AI system detected unusual gathering of 12+ individuals with criminal history in Saddar area.',
    location: 'Saddar, Peshawar', timestamp: '2024-11-15T22:30:00', acknowledged: false,
  },
  {
    id: 'a3', type: 'warning', title: 'DRUG ROUTE PREDICTED',
    message: 'Predictive model indicates 87% probability of drug movement on GT Road tonight between 2-4 AM.',
    location: 'GT Road', timestamp: '2024-11-15T20:15:00', acknowledged: false,
  },
  {
    id: 'a4', type: 'warning', title: 'SUSPICIOUS VEHICLE',
    message: 'Vehicle with fake plates reported near National Bank. CCTV tracking active.',
    location: 'Bank Road, Peshawar', timestamp: '2024-11-15T19:45:00', acknowledged: true,
  },
  {
    id: 'a5', type: 'info', title: 'OFFICER DEPLOYMENT REMINDER',
    message: 'Night patrol shift change at 00:00. Ensure all posts are covered.',
    timestamp: '2024-11-15T18:00:00', acknowledged: true,
  },
  {
    id: 'a6', type: 'critical', title: 'FACIAL RECOGNITION MATCH',
    message: 'Wanted suspect Sajida Bibi (Mama Bear) detected at Gulbahar market CCTV camera #4.',
    location: 'Gulbahar Market, Peshawar', timestamp: '2024-11-15T17:22:00', acknowledged: false,
  },
];

// ─── Mock FIR List ────────────────────────────────────────────────────────────

export const MOCK_FIRS: FIR[] = MOCK_CRIMES.map((c, i) => ({
  id: `fir-${i + 1}`,
  firNumber: c.firNumber,
  complainant: ['Muhammad Ali', 'Fatima Bibi', 'TechCorp Ltd', 'ANF Team', 'N/A', 'Zahid Gul', 'Victim Group', 'Parent'][i] || 'Unknown',
  phone: `+92-91-${Math.floor(Math.random() * 9000000 + 1000000)}`,
  crimeType: c.type,
  date: c.date,
  location: c.location.address,
  description: c.description,
  status: c.status,
  assignedOfficer: ['Bilal Shah', 'Zara Khan', 'Zara Khan', 'Bilal Shah', 'Bilal Shah', 'Bilal Shah', 'Zara Khan', 'Bilal Shah'][i] || 'Unknown',
  priority: c.severity,
  evidence: c.evidence,
  createdAt: c.date + 'T' + c.time + ':00',
}));

// ─── Analytics Data ───────────────────────────────────────────────────────────

export const CRIME_TREND_DATA = [
  { month: 'Jun', robbery: 12, assault: 18, fraud: 8, cybercrime: 5, drugs: 9, homicide: 2 },
  { month: 'Jul', robbery: 15, assault: 21, fraud: 11, cybercrime: 7, drugs: 12, homicide: 3 },
  { month: 'Aug', robbery: 10, assault: 16, fraud: 9, cybercrime: 9, drugs: 8, homicide: 1 },
  { month: 'Sep', robbery: 18, assault: 25, fraud: 13, cybercrime: 12, drugs: 15, homicide: 4 },
  { month: 'Oct', robbery: 22, assault: 19, fraud: 16, cybercrime: 15, drugs: 11, homicide: 2 },
  { month: 'Nov', robbery: 28, assault: 31, fraud: 20, cybercrime: 18, drugs: 22, homicide: 5 },
];

export const CRIME_BY_TYPE_DATA = [
  { name: 'Assault', value: 31, color: '#ef4444' },
  { name: 'Robbery', value: 28, color: '#f59e0b' },
  { name: 'Drugs', value: 22, color: '#8b5cf6' },
  { name: 'Fraud', value: 20, color: '#0ea5e9' },
  { name: 'Cybercrime', value: 18, color: '#06b6d4' },
  { name: 'Burglary', value: 12, color: '#10b981' },
  { name: 'Others', value: 9, color: '#6b7280' },
];

export const HOURLY_CRIME_DATA = [
  { hour: '00', crimes: 8 }, { hour: '02', crimes: 12 }, { hour: '04', crimes: 6 },
  { hour: '06', crimes: 3 }, { hour: '08', crimes: 5 }, { hour: '10', crimes: 7 },
  { hour: '12', crimes: 9 }, { hour: '14', crimes: 11 }, { hour: '16', crimes: 14 },
  { hour: '18', crimes: 19 }, { hour: '20', crimes: 22 }, { hour: '22', crimes: 16 },
];

export const PREDICTION_DATA = [
  { month: 'Dec', predicted: 34, confidence: 82 },
  { month: 'Jan', predicted: 29, confidence: 74 },
  { month: 'Feb', predicted: 25, confidence: 68 },
  { month: 'Mar', predicted: 31, confidence: 71 },
];

export const AREA_RISK_DATA = [
  { area: 'Saddar', risk: 92, crimes: 45 },
  { area: 'Hayatabad', risk: 78, crimes: 32 },
  { area: 'University Road', risk: 65, crimes: 28 },
  { area: 'GT Road', risk: 85, crimes: 38 },
  { area: 'Gulbahar', risk: 58, crimes: 21 },
  { area: 'Cantt Area', risk: 42, crimes: 15 },
];

// ─── Map Heat Points ──────────────────────────────────────────────────────────

export const HEAT_POINTS = [
  { lat: 33.738, lng: 72.981, intensity: 0.9, label: 'Bank Road - High Risk' },
  { lat: 33.745, lng: 72.990, intensity: 0.85, label: 'Saddar - Very High Risk' },
  { lat: 33.750, lng: 72.970, intensity: 0.6, label: 'IT Zone - Medium Risk' },
  { lat: 33.720, lng: 72.965, intensity: 0.75, label: 'GT Road - High Risk' },
  { lat: 33.762, lng: 72.995, intensity: 0.95, label: 'Phase 5 - Critical Risk' },
  { lat: 33.732, lng: 72.985, intensity: 0.55, label: 'University Road - Medium Risk' },
  { lat: 33.756, lng: 72.976, intensity: 0.65, label: 'Gulbahar - Medium Risk' },
  { lat: 33.740, lng: 72.960, intensity: 0.8, label: 'Charsadda Road - High Risk' },
  { lat: 33.728, lng: 72.975, intensity: 0.45, label: 'Cantt - Low Risk' },
  { lat: 33.758, lng: 73.000, intensity: 0.7, label: 'Ring Road - High Risk' },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  totalCrimes: 1284,
  activeCases: 47,
  solvedCases: 892,
  suspects: 156,
  officers: 34,
  alertsToday: 12,
  solutionRate: 69.5,
  avgResponseTime: '8.2 min',
};
