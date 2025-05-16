
import Link from 'next/link';
import { ParkingCircle, QrCode, ScanLine, MessageSquare, Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <ParkingCircle size={32} />
          <span>ParkWatch Pass</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-end">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <ParkingCircle size={18} /> Book
          </Link>
          <Link href="/confirmation" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <QrCode size={18} /> My QR
          </Link>
          <Link href="/scan" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <ScanLine size={18} /> Scan
          </Link>
          <Link href="/feedback" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <MessageSquare size={18} /> Feedback
          </Link>
          <Link href="/chatbot" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <Bot size={18} /> AI Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
