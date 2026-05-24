import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '@/lib/ThemeContext';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CPIS — Crime Pattern Intelligence System',
  description: 'AI-powered crime analysis and prediction dashboard',
  icons: {
    icon: '/icons/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0d1424',
                  color: '#e2e8f0',
                  border: '1px solid rgba(14,165,233,0.3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#0d1424' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#0d1424' },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
