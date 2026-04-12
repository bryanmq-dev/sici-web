import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'SICI - UNIVALLE | Investigación e Innovación',
  description: 'Sociedad de Investigación, Ciencia e Innovación de Ingeniería de Sistemas e Informática – UNIVALLE',
};

import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/context/ThemeContext';
import SICIBot from '@/components/SICIBot';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-background text-on-surface min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <div className="fixed inset-0 pointer-events-none z-[99] grid-bg opacity-20" />
            <div className="scanline" />
            <div className="noise" />
            <div className="relative z-10">
              {children}
            </div>
            <SICIBot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
