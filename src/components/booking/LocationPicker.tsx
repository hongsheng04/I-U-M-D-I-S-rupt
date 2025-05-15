
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
  { id: 'pw_a1', name: 'ParkWatch Lot A1', address: '101 Alpha Rd, Sector A', hourlyRate: 4.5, availableSpots: 15 },
  { id: 'pw_a2', name: 'ParkWatch Lot A2', address: '102 Alpha Rd, Sector A', hourlyRate: 4.5, availableSpots: 10 },
  { id: 'pw_a3', name: 'ParkWatch Lot A3', address: '103 Alpha Rd, Sector A', hourlyRate: 4.0, availableSpots: 20 },
  { id: 'pw_b1', name: 'ParkWatch Lot B1', address: '201 Bravo St, Sector B', hourlyRate: 5.0, availableSpots: 5 },
  { id: 'pw_b2', name: 'ParkWatch Lot B2', address: '202 Bravo St, Sector B', hourlyRate: 5.0, availableSpots: 12 },
  { id: 'pw_b3', name: 'ParkWatch Lot B3', address: '203 Bravo St, Sector B', hourlyRate: 4.75, availableSpots: 8 },
  { id: 'pw_c1', name: 'ParkWatch Lot C1', address: '301 Charlie Ave, Sector C', hourlyRate: 3.5, availableSpots: 30 },
  { id: 'pw_c2', name: 'ParkWatch Lot C2', address: '302 Charlie Ave, Sector C', hourlyRate: 3.5, availableSpots: 25 },
  { id: 'pw_c3', name: 'ParkWatch Lot C3', address: '303 Charlie Ave, Sector C', hourlyRate: 3.75, availableSpots: 18 },
];

export function LocationPicker({ selectedLocation, onLocationSelect }: LocationPickerProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="text-primary" /> Select ParkWatch Location</CardTitle>
        <CardDescription>Choose your preferred ParkWatch parking lot from the available locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 h-64 md:h-96 w-full bg-muted rounded-lg overflow-hidden relative">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Map placeholder showing ParkWatch lots"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city map parking"
          />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white text-xl font-semibold p-4 bg-black/50 rounded-md">Map Area: Interactive Map Coming Soon!</p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-3 text-foreground">Available ParkWatch Lots:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LOCATIONS.map((loc) => (
            <Button
              key={loc.id}
              variant={selectedLocation?.id === loc.id ? "default" : "outline"}
              onClick={() => onLocationSelect(loc)}
              className="w-full h-auto py-3 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow"
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
