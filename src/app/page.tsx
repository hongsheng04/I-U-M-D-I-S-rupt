"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationPicker } from '@/components/booking/LocationPicker';
import { BookingForm } from '@/components/booking/BookingForm';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import type { Location, BookingDetails } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function BookingPage() {
  const router = useRouter();
  const { bookingDetails, setBookingDetails } = useBooking();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(bookingDetails.location);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleBookingSubmit = (data: Pick<BookingDetails, 'duration' | 'vehiclePlate'>) => {
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a parking location first.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const totalPrice = data.duration * selectedLocation.hourlyRate;
    setBookingDetails({
      location: selectedLocation,
      duration: data.duration,
      vehiclePlate: data.vehiclePlate,
      totalPrice,
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/payment');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Welcome to ParkPass</h1>
        <p className="text-lg text-muted-foreground">Find and book your parking spot in minutes.</p>
      </div>
      <Separator />
      <LocationPicker selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} />
      {selectedLocation && <BookingForm selectedLocation={selectedLocation} onSubmit={handleBookingSubmit} isLoading={isLoading} />}
    </div>
  );
}
