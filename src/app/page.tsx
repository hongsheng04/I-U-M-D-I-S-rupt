
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocationPicker } from '@/components/booking/LocationPicker';
import { SpotPicker } from '@/components/booking/SpotPicker';
import { BookingForm } from '@/components/booking/BookingForm';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import type { Location, BookingDetails } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function BookingPage() {
  const router = useRouter();
  const { bookingDetails, setBookingDetails, resetBooking } = useBooking();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(bookingDetails.location);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(bookingDetails.selectedSpot || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Effect to reset spot if location changes or if booking is reset elsewhere
  useEffect(() => {
    if (bookingDetails.location !== selectedLocation) {
      setSelectedLocation(bookingDetails.location);
      setSelectedSpot(bookingDetails.selectedSpot || null);
    }
    if (!bookingDetails.location) { // If booking was reset
        setSelectedLocation(null);
        setSelectedSpot(null);
    }
  }, [bookingDetails.location, bookingDetails.selectedSpot, selectedLocation]);


  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSelectedSpot(null); // Reset spot when new location is picked
    // Update context partially, SpotPicker will update the spot
    setBookingDetails(prev => ({ ...prev, location, selectedSpot: null }));
  };

  const handleSpotSelect = (spot: string) => {
    setSelectedSpot(spot);
    // Update context with the selected spot
    setBookingDetails(prev => ({ ...prev, selectedSpot: spot }));
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
    if (!selectedSpot) {
      toast({
        title: "Error",
        description: "Please select a parking spot first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const totalPrice = data.duration * selectedLocation.hourlyRate;
    
    setBookingDetails({
      location: selectedLocation,
      selectedSpot: selectedSpot,
      duration: data.duration,
      vehiclePlate: data.vehiclePlate,
      totalPrice,
    });
    
    // Simulate API call delay
    // In a real application, this is where you would integrate with the ParkWatch system
    // to confirm the booking session for the selectedLocation, selectedSpot and its availability.
    // For example, ParkWatch.confirmBooking(selectedLocation.id, selectedSpot, data.duration);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/payment');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Welcome to ParkWatch Pass</h1>
        <p className="text-lg text-muted-foreground">Find and book your ParkWatch parking spot in minutes.</p>
      </div>
      <Separator />
      
      <LocationPicker 
        selectedLocation={selectedLocation} 
        onLocationSelect={handleLocationSelect} 
      />

      {selectedLocation && (
        <SpotPicker 
          selectedLocationName={selectedLocation.name}
          selectedSpot={selectedSpot}
          onSpotSelect={handleSpotSelect}
        />
      )}
      
      {selectedLocation && selectedSpot && (
        <BookingForm 
          selectedLocation={selectedLocation} 
          selectedSpot={selectedSpot}
          onSubmit={handleBookingSubmit} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}
