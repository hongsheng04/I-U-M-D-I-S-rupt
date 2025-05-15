"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ScanStatus = "idle" | "scanning" | "success" | "error";

export function QRCodeScanner() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSimulateScan = () => {
    setScanStatus("scanning");
    // Simulate scanning delay and result
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      if (success) {
        const mockData = JSON.stringify({
          bookingId: `PARKWATCHPASS-SIM-${Date.now()}`, // Updated prefix
          location: "Simulated Lot A",
          plate: "XYZ-789",
          status: "VALID"
        });
        setScannedData(mockData);
        setScanStatus("success");
        toast({ title: "Scan Successful", description: "QR Code Validated." });
      } else {
        setScannedData(null);
        setScanStatus("error");
        toast({ title: "Scan Failed", description: "Invalid or unreadable QR Code.", variant: "destructive" });
      }
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd use a library to read QR from image
      toast({ title: "File Uploaded", description: `${file.name} selected. Simulating scan...` });
      handleSimulateScan(); // Simulate scan after upload
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScannedData(null);
  }

  return (
    <Card className="shadow-lg max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ScanLine className="text-primary"/> Scan QR Code</CardTitle>
        <CardDescription>Authenticate entry/exit by scanning a ParkWatch Pass QR code.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {scanStatus === "idle" && (
          <div className="space-y-4">
            <Button onClick={handleSimulateScan} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
              <ScanLine className="mr-2"/> Simulate Scan
            </Button>
            <div>
              <Label htmlFor="qr-upload" className="text-foreground">Or Upload QR Code Image</Label>
              <Input id="qr-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} className="mt-1 bg-background"/>
            </div>
          </div>
        )}

        {scanStatus === "scanning" && (
          <div className="text-center py-4">
            <ScanLine className="h-12 w-12 text-primary animate-pulse mx-auto mb-2" />
            <p className="text-muted-foreground">Scanning...</p>
          </div>
        )}

        {scanStatus === "success" && scannedData && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-700">Scan Successful!</h3>
            <p className="text-sm text-green-600 break-all">Data: {scannedData.substring(0,100)}...</p>
            <Button onClick={resetScan} variant="outline" className="mt-4">Scan Another</Button>
          </div>
        )}

        {scanStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-red-700">Scan Failed</h3>
            <p className="text-sm text-red-600">Could not validate the QR code. Please try again.</p>
            <Button onClick={resetScan} variant="outline" className="mt-4">Try Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
