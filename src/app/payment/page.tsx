"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { bookingDetails, setQrCodeData } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!bookingDetails.location) {
      // If no booking details, redirect to home
      toast({
        title: "Session Expired",
        description: "Booking details not found. Please start over.",
        variant: "destructive",
      });
      router.replace('/');
    }
  }, [bookingDetails, router, toast]);

  const handlePaymentSubmit = async (paymentData: any) => {
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const qrData = JSON.stringify({
      bookingId: `PARKPASS-${Date.now()}`,
      location: bookingDetails.location?.name,
      plate: bookingDetails.vehiclePlate,
      duration: bookingDetails.duration,
      paid: bookingDetails.totalPrice,
      timestamp: new Date().toISOString(),
    });
    setQrCodeData(qrData);

    setIsLoading(false);
    toast({
      title: "Payment Successful!",
      description: "Your parking spot is booked.",
    });
    router.push('/confirmation');
  };

  if (!bookingDetails.location) {
    return <div className="text-center py-10">Loading booking details or redirecting...</div>;
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Booking Details
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Complete Your Booking</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="text-primary"/>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground">
            <p><strong>Location:</strong> {bookingDetails.location.name}</p>
            <p><strong>Address:</strong> {bookingDetails.location.address}</p>
            <p><strong>Duration:</strong> {bookingDetails.duration} hour(s)</p>
            <p><strong>Vehicle Plate:</strong> {bookingDetails.vehiclePlate}</p>
            <p className="text-xl font-semibold text-primary">
              <strong>Total Price:</strong> ${bookingDetails.totalPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
