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
  { id: 'loc1', name: 'Downtown Central Parking', address: '123 Main St, Anytown', hourlyRate: 5, availableSpots: 25 },
  { id: 'loc2', name: 'City Mall Garage', address: '456 Market Ave, Anytown', hourlyRate: 3.5, availableSpots: 150 },
  { id: 'loc3', name: 'Airport Economy Lot', address: '789 Airport Rd, Anytown', hourlyRate: 2, availableSpots: 300 },
];

export function LocationPicker({ selectedLocation, onLocationSelect }: LocationPickerProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="text-primary" /> Select Parking Location</CardTitle>
        <CardDescription>Choose your preferred parking spot from the available locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 h-64 md:h-96 w-full bg-muted rounded-lg overflow-hidden relative">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Map placeholder"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city map parking"
          />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white text-xl font-semibold p-4 bg-black/50 rounded-md">Map Area: Interactive Map Coming Soon!</p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-3 text-foreground">Available Locations:</h3>
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
