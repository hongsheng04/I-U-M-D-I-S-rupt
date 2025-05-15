
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Grid3x3, QrCode, Smartphone, Banknote } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { bookingDetails, setQrCodeData } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!bookingDetails.location || !bookingDetails.selectedSpot) {
      toast({
        title: "Session Expired",
        description: "Booking details not found or incomplete. Please start over.",
        variant: "destructive",
      });
      router.replace('/');
    }
  }, [bookingDetails, router, toast]);

  const handlePaymentConfirmation = async () => {
    setIsLoading(true);
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const qrData = JSON.stringify({
      bookingId: `PARKPASS-${Date.now()}`,
      location: bookingDetails.location?.name,
      spot: bookingDetails.selectedSpot,
      plate: bookingDetails.vehiclePlate,
      duration: bookingDetails.duration,
      paid: bookingDetails.totalPrice,
      timestamp: new Date().toISOString(),
    });
    setQrCodeData(qrData);

    setIsLoading(false);
    toast({
      title: "Payment Confirmed!",
      description: "Your parking spot is booked.",
    });
    router.push('/confirmation');
  };

  if (!bookingDetails.location || !bookingDetails.selectedSpot) {
    return <div className="text-center py-10">Loading booking details or redirecting...</div>;
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Booking Details
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Complete Your Payment</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="text-primary"/>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground">
            <p><strong>Location:</strong> {bookingDetails.location.name}</p>
            <p><strong>Spot:</strong> <Grid3x3 className="inline-block mr-1 h-4 w-4 text-primary"/>{bookingDetails.selectedSpot}</p>
            <p><strong>Address:</strong> {bookingDetails.location.address}</p>
            <p><strong>Duration:</strong> {bookingDetails.duration} hour(s)</p>
            <p><strong>Vehicle Plate:</strong> {bookingDetails.vehiclePlate}</p>
            <p className="text-xl font-semibold text-primary">
              <strong>Total Price:</strong> RM{bookingDetails.totalPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="text-primary"/>Scan to Pay</CardTitle>
            <CardDescription>Use your preferred eWallet or banking app to scan the QR code below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg bg-secondary/30 text-center space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center justify-center gap-2"><Smartphone className="h-5 w-5"/>TNG eWallet</h3>
                <Image 
                  src="https://placehold.co/200x200.png" 
                  alt="TNG eWallet QR Code Placeholder" 
                  width={180} 
                  height={180}
                  className="mx-auto rounded-md shadow-md"
                  data-ai-hint="qr code" 
                />
                <p className="text-sm text-muted-foreground">Scan with your TNG eWallet app.</p>
              </div>
              <div className="p-4 border rounded-lg bg-secondary/30 text-center space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center justify-center gap-2"><Banknote className="h-5 w-5"/>Online Banking (DuitNow QR)</h3>
                 <Image 
                  src="https://placehold.co/200x200.png" 
                  alt="Bank QR Code Placeholder" 
                  width={180} 
                  height={180}
                  className="mx-auto rounded-md shadow-md"
                  data-ai-hint="qr code banking" 
                />
                <p className="text-sm text-muted-foreground">Scan with any supporting bank app.</p>
              </div>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-2">
              Note: These are placeholder QR codes for demonstration purposes.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handlePaymentConfirmation} 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Confirming Payment...' : "I've Scanned & Paid - Book My Spot"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
