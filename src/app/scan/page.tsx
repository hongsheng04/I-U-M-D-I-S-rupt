"use client";

import { QRCodeScanner } from '@/components/qr/QRCodeScanner';

export default function ScanPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Scan Your ParkWatch Pass</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Present your QR code to the scanner or upload an image.
        </p>
      </div>
      <QRCodeScanner />
    </div>
  );
}
