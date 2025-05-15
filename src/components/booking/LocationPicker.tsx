
"use client";

import Image from 'next/image';
import type { Location } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

const MOCK_LOCATIONS: Location[] = [
  { id: 'pw_a1', name: 'Airport Economy Lot', address: '789 Skyway Rd, Terminal Area', hourlyRate: 3.0, availableSpots: 150 },
  { id: 'pw_a2', name: 'Downtown Metro Garage', address: '123 Main St, City Center', hourlyRate: 5.5, availableSpots: 80 },
  { id: 'pw_a3', name: 'City Center Mall Parking', address: '456 Commerce Ave, Retail District', hourlyRate: 4.0, availableSpots: 200 },
  { id: 'pw_b1', name: 'University Campus Lot B', address: '10 University Dr, Academic Zone', hourlyRate: 2.5, availableSpots: 120 },
  { id: 'pw_b2', name: 'General Hospital Visitor Parking', address: '20 Healthway Blvd, Medical Campus', hourlyRate: 4.75, availableSpots: 60 },
  { id: 'pw_b3', name: 'Stadium Event Parking - North', address: '30 Victory Ln, Sports Complex', hourlyRate: 10.0, availableSpots: 300 },
  { id: 'pw_c1', name: 'Westside Business Park Deck', address: '500 Corporate Pkwy, Business District', hourlyRate: 3.75, availableSpots: 90 },
  { id: 'pw_c2', name: 'Coastal View Beach Access', address: '1 Ocean Front Walk, Coastal Area', hourlyRate: 6.0, availableSpots: 40 },
  { id: 'pw_c3', name: 'Mountain Trailhead Parking', address: '99 Peak Rd, Recreational Area', hourlyRate: 1.5, availableSpots: 50 },
];

export function LocationPicker({ selectedLocation, onLocationSelect }: LocationPickerProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="text-primary" /> Select Parking Destination</CardTitle>
        <CardDescription>Choose your preferred parking destination. Availability is powered by the ParkWatch system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 h-64 md:h-96 w-full bg-muted rounded-lg overflow-hidden relative">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Map placeholder showing parking destinations"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city map destinations"
          />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white text-xl font-semibold p-4 bg-black/50 rounded-md">Map Area: Visualizing ParkWatch Monitored Locations (Interactive Map Coming Soon!)</p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-3 text-foreground">Available Parking Destinations:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LOCATIONS.map((loc) => (
            <Button
              key={loc.id}
              variant={selectedLocation?.id === loc.id ? "default" : "outline"}
              onClick={() => onLocationSelect(loc)}
              className="w-full h-auto py-3 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow"
              aria-label={`Select parking at ${loc.name}`}
            >
              <span className="font-semibold text-base">{loc.name}</span>
              <span className="text-xs text-muted-foreground">{loc.address}</span>
              <span className="text-xs mt-1">Rate: ${loc.hourlyRate.toFixed(2)}/hr - Spots: {loc.availableSpots}</span>
            </Button>
          ))}
        </div>

        {selectedLocation && (
          <div className="mt-6 p-4 bg-secondary rounded-lg shadow">
            <h4 className="font-semibold text-secondary-foreground">Selected:</h4>
            <p className="text-secondary-foreground">{selectedLocation.name} - ${selectedLocation.hourlyRate.toFixed(2)}/hr</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
