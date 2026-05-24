# 🛡️ CPIS — Crime Pattern Intelligence System

A full-stack, AI-powered crime analysis dashboard built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 🔐 **Authentication** | Role-based login (Admin / Analyst / Officer) |
| 🌗 **Dark / Light Mode** | Persistent theme toggle |
| 📋 **FIR Management** | Full CRUD — Create, View, Edit, Delete FIRs |
| 🗺️ **Crime Heatmap** | Interactive Leaflet map with crime markers & heat zones |
| 📊 **Analytics Dashboard** | Area/Line/Bar/Radar/Pie charts with Recharts |
| 🤖 **AI Predictions** | Crime trend forecasting with confidence scores |
| 🚨 **Alert System** | Emergency alerts with acknowledge & broadcast |
| 👤 **Suspect Database** | Facial recognition simulation + CRUD profiles |
| ⚙️ **Settings** | Account, appearance, notifications, security, database |
| 🔌 **REST API** | Full Express-style API routes via Next.js App Router |

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **Animations**: Framer Motion, CSS keyframes
- **Icons**: Lucide React
- **Toasts**: React Hot Toast
- **Fonts**: Orbitron, Rajdhani, JetBrains Mono

---

## 🗂️ Project Structure

```
crime-intel/
├── app/
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx                # Redirect to /dashboard
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + header layout
│   │   ├── page.tsx            # Main dashboard
│   │   ├── fir/page.tsx        # FIR records CRUD
│   │   ├── analytics/page.tsx  # Charts & AI predictions
│   │   ├── heatmap/page.tsx    # Crime map
│   │   ├── alerts/page.tsx     # Emergency alerts
│   │   ├── suspects/page.tsx   # Suspect DB + facial recognition
│   │   └── settings/page.tsx   # System settings
│   └── api/
│       ├── auth/route.ts       # POST /api/auth
│       ├── crimes/route.ts     # GET/POST /api/crimes
│       ├── fir/route.ts        # GET/POST /api/fir
│       ├── alerts/route.ts     # GET/POST /api/alerts
│       └── analytics/route.ts  # GET /api/analytics
├── components/
│   └── CrimeMap.tsx            # Leaflet map component
├── lib/
│   ├── data.ts                 # All mock data & types
│   ├── auth.ts                 # Login / session helpers
│   ├── AuthContext.tsx         # Auth React context
│   └── ThemeContext.tsx        # Theme React context
├── styles/
│   └── globals.css             # Global styles + CSS vars
└── public/
    └── icons/favicon.svg
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Navigate to project
cd crime-intel

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@cpis.gov` | `admin123` |
| 🔍 Analyst | `analyst@cpis.gov` | `analyst123` |
| 👮 Officer | `officer@cpis.gov` | `officer123` |

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth
Body: { email, password }
Returns: { user, token }
```

### Crimes
```
GET  /api/crimes?type=robbery&severity=critical&limit=10
POST /api/crimes
Body: { type, severity, location, description, officerId }
```

### FIR Records
```
GET  /api/fir?status=open&priority=high
POST /api/fir
Body: { complainant, phone, crimeType, date, location, description }
```

### Alerts
```
GET  /api/alerts?type=critical&unacknowledged=true
POST /api/alerts
Body: { type, title, message, location }
```

### Analytics
```
GET /api/analytics
Returns: { stats, trends, byType, hourly, predictions, areaRisk, aiInsights }
```

---

## 🎨 Theme & Design

- **Dark mode**: Deep navy/black cyber aesthetic with cyan glow effects
- **Light mode**: Clean white with blue accents
- **Fonts**: Orbitron (display), Rajdhani (body), JetBrains Mono (code/data)
- **Animations**: Scan lines, pulsing alerts, animated counters

---

## 📋 Build for Production

```bash
npm run build
npm start
```

---

## 🧩 Extending the Project

- Replace mock data in `lib/data.ts` with a real database (PostgreSQL + Prisma)
- Add real JWT authentication in `app/api/auth/route.ts`
- Integrate real facial recognition API (AWS Rekognition, Azure Face)
- Add WebSocket for real-time alert streaming
- Connect to Google Maps API for better mapping

---

**CPIS © 2024 — For educational and law enforcement training purposes**
