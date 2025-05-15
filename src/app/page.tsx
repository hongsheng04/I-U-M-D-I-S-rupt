
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

  // Effect to sync local state with context, e.g. if booking is reset elsewhere
  useEffect(() => {
    if (bookingDetails.location !== selectedLocation || bookingDetails.selectedSpot !== selectedSpot) {
      setSelectedLocation(bookingDetails.location);
      setSelectedSpot(bookingDetails.selectedSpot || null);
    }
  }, [bookingDetails.location, bookingDetails.selectedSpot, selectedLocation, selectedSpot]);


  const handleLocationSelect = (location: Location) => {
    if (selectedLocation?.id === location.id) {
      // Deselect if the same location is clicked again
      setSelectedLocation(null);
      setSelectedSpot(null);
      setBookingDetails(prev => ({ ...prev, location: null, selectedSpot: null, totalPrice: 0 }));
    } else {
      // Select new location
      setSelectedLocation(location);
      setSelectedSpot(null); // Reset spot when new location is picked
      setBookingDetails(prev => ({ ...prev, location, selectedSpot: null, totalPrice: 0 }));
    }
  };

  const handleSpotSelect = (spot: string) => {
    // This MOCK_BOOKED_SPOTS_BY_LOCATION should be consistent with SpotPicker.tsx
    // It's now empty, so no spots will be considered pre-booked by this safeguard.
    const MOCK_BOOKED_SPOTS_BY_LOCATION_SAFEGUARD: Record<string, string[]> = {};
    const currentBookedSpots = selectedLocation ? (MOCK_BOOKED_SPOTS_BY_LOCATION_SAFEGUARD[selectedLocation.id] || []) : [];
    
    if (currentBookedSpots.includes(spot)) {
        // This should ideally not be triggered if button is disabled, but as a safeguard:
        toast({
            title: "Spot Unavailable",
            description: `Spot ${spot} is already booked. Please choose another.`,
            variant: "destructive",
        });
        return;
    }

    if (selectedSpot === spot) {
      // Deselect if the same spot is clicked again
      setSelectedSpot(null);
      setBookingDetails(prev => ({ ...prev, selectedSpot: null, totalPrice: 0 }));
    } else {
      // Select new spot
      setSelectedSpot(spot);
      setBookingDetails(prev => ({ ...prev, selectedSpot: spot }));
    }
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
    // to confirm the booking session for the selectedLocation.id, selectedSpot and its availability.
    // For example, ParkWatch.confirmBooking(selectedLocation.id, selectedSpot, data.duration);
    setTimeout(() => {
      router.push('/payment');
      setIsLoading(false); // Set loading to false after attempting navigation
    }, 1000);
  };
  

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Welcome to ParkWatch Pass</h1>
        <p className="text-lg text-muted-foreground">Find and book your parking spot in minutes, with real-time availability from the ParkWatch system.</p>
      </div>
      <Separator />
      
      <LocationPicker 
        selectedLocation={selectedLocation} 
        onLocationSelect={handleLocationSelect} 
      />

      {selectedLocation && (
        <SpotPicker 
          selectedLocationId={selectedLocation.id} // Pass the location ID
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
