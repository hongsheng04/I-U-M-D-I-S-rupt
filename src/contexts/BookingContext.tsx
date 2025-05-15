"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from 'react';
import type { BookingDetails, BookingContextType, Location } from '@/types';

const initialLocation: Location = {
  id: '',
  name: '',
  address: '',
  hourlyRate: 0,
  availableSpots: 0,
};

const initialBookingDetails: BookingDetails = {
  location: null,
  duration: 1,
  vehiclePlate: '',
  totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(initialBookingDetails);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const resetBooking = () => {
    setBookingDetails(initialBookingDetails);
    setQrCodeData(null);
  };

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails, qrCodeData, setQrCodeData, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
