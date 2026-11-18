import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mission Control v3',
  description: 'Operational command center for the Lux AI agent swarm',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="nostalgia" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-14 md:ml-56">
              <Header />
              <main className="p-6 max-w-[1400px] mx-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
