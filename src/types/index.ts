export interface Location {
  id: string;
  name: string;
  address: string;
  hourlyRate: number;
  availableSpots: number;
}

export interface BookingDetails {
  location: Location | null;
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
