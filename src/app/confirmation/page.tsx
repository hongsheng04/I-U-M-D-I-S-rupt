
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Grid3x3, Undo2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConfirmationPage() {
  const router = useRouter();
  const { bookingDetails, qrCodeData, resetBooking } = useBooking();
  const { toast } = useToast();
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (isCancelled) return; // Don't redirect if cancellation process led to this state

    if (!qrCodeData || !bookingDetails.location || !bookingDetails.selectedSpot) {
      toast({
        title: "No active booking",
        description: "Please complete a booking to view confirmation.",
        variant: "destructive",
      });
      router.replace('/');
    }
  }, [qrCodeData, bookingDetails, router, toast, isCancelled]);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas'); // qrcode.react renders a canvas
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ParkWatchPass-QR-${bookingDetails.vehiclePlate}-${bookingDetails.selectedSpot}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast({ title: "QR Code Downloaded", description: "Your QR code has been saved."});
    } else {
       toast({ title: "Download Failed", description: "Could not find QR code image to download.", variant: "destructive"});
    }
  };
  
  const handleNewBooking = () => {
    resetBooking();
    router.push('/');
  }

  const handleCancelBooking = () => {
    if (!bookingDetails.location || !bookingDetails.selectedSpot) {
        toast({ title: "Error", description: "No booking to cancel.", variant: "destructive" });
        router.replace('/'); // Should not happen if page loaded correctly
        return;
    }

    const spot = bookingDetails.selectedSpot;
    const locationName = bookingDetails.location.name;
    const amount = bookingDetails.totalPrice;

    toast({
      title: "Booking Cancellation Initiated",
      description: `Your booking for spot ${spot} at ${locationName} has been cancelled. A full refund of RM${amount.toFixed(2)} will be processed.`,
    });
    
    resetBooking();
    setIsCancelled(true);
  };

  if (isCancelled) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto text-center py-10">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Booking Cancelled</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your booking has been successfully cancelled, and a full refund is being processed.
          </p>
          <p className="text-md text-muted-foreground mt-1">
            Thank you for using ParkWatch Pass.
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Home className="mr-2 h-4 w-4" /> Make a New Booking
        </Button>
      </div>
    );
  }

  if (!qrCodeData || !bookingDetails.location || !bookingDetails.selectedSpot) {
    return <div className="text-center py-10">Loading confirmation or redirecting...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <div className="flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Thank you, {bookingDetails.vehiclePlate}! Your parking spot <Grid3x3 className="inline-block mr-1 h-5 w-5 text-accent"/><strong>{bookingDetails.selectedSpot}</strong> at {bookingDetails.location.name} is confirmed.
        </p>
      </div>

      <QRCodeDisplay qrData={qrCodeData} />

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        <Button onClick={handleDownloadQR} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Download QR Code
        </Button>
        <Button onClick={handleNewBooking} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Home className="mr-2 h-4 w-4" /> Book Another Spot
        </Button>
        <Button onClick={handleCancelBooking} variant="outline" className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10">
          <Undo2 className="mr-2 h-4 w-4" /> Cancel & Refund
        </Button>
      </div>
    </div>
  );
}
