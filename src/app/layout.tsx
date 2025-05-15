import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { BookingProvider } from '@/contexts/BookingContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ParkWatch Pass - Smart Parking Solutions',
  description: 'Book parking spaces easily with ParkWatch Pass and get your QR code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <BookingProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-muted text-muted-foreground py-6 text-center">
            <p>&copy; {new Date().getFullYear()} ParkWatch Pass. All rights reserved.</p>
          </footer>
          <Toaster />
        </BookingProvider>
      </body>
    </html>
  );
}
