"use client";

import QRCode from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCodeIcon } from 'lucide-react'; // Corrected icon name from lucide-react

interface QRCodeDisplayProps {
  qrData: string;
}

export function QRCodeDisplay({ qrData }: QRCodeDisplayProps) {
  if (!qrData) {
    return (
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2"><QrCodeIcon className="text-destructive"/> QR Code Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">No QR code data available. Please complete a booking first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2"><QrCodeIcon className="text-primary"/> Your Parking Pass</CardTitle>
        <CardDescription>Scan this QR code at the parking entrance/exit.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="p-4 bg-white rounded-lg shadow-inner inline-block">
          <QRCode
            value={qrData}
            size={256}
            level="H" // Error correction level: H (High)
            includeMargin={true}
            fgColor="var(--foreground)" // Using CSS variable for foreground
            bgColor="var(--background)" // Using CSS variable for background
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground break-all max-w-xs">Data: {qrData.substring(0,100)}...</p>
      </CardContent>
    </Card>
  );
}
