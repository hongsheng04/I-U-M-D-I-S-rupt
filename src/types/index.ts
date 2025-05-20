export interface Location {
  id: string;
  name: string;
  address: string;
  hourlyRate: number;
  availableSpots: number; // This might represent total spots in the lot
  latitude?: number; // Geographic coordinate
  longitude?: number; // Geographic coordinate
}

export interface BookingDetails {
  location: Location | null;
  selectedSpot?: string | null; // e.g., "A1", "B2", etc.
  duration: number; // in hours
  vehiclePlate: string;
  totalPrice: number;
  bookingTime?: Date;
}

export interface BookingContextType {
  bookingDetails: BookingDetails;
  setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;
  qrCodeData: string | null;
  setQrCodeData: (data: string | null) => void;
  resetBooking: () => void;
}
