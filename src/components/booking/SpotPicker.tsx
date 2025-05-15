
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3 } from 'lucide-react';

interface SpotPickerProps {
  selectedLocationId: string; // Added to identify the current location
  selectedLocationName: string;
  selectedSpot: string | null;
  onSpotSelect: (spot: string) => void;
}

const SPOTS_LAYOUT: string[][] = [
  ['A1', 'A2', 'A3'],
  ['B1', 'B2', 'B3'],
  ['C1', 'C2', 'C3'],
];

// Simulate some spots being booked per location
// Keys are location IDs from MOCK_LOCATIONS in LocationPicker.tsx
// Changed to start all locations with no spots booked.
const MOCK_BOOKED_SPOTS_BY_LOCATION: Record<string, string[]> = {
  // Example: If Airport Economy Lot (pw_a1) had spots A1 and B2 booked:
  // 'pw_a1': ['A1', 'B2'],
  // For now, all locations will start with no spots pre-booked.
};

export function SpotPicker({ selectedLocationId, selectedLocationName, selectedSpot, onSpotSelect }: SpotPickerProps) {
  const bookedSpotsForCurrentLocation = MOCK_BOOKED_SPOTS_BY_LOCATION[selectedLocationId] || [];

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="text-primary" /> Select Your Spot at {selectedLocationName}
        </CardTitle>
        <CardDescription>Choose an available spot. This grid reflects the current layout and availability from the ParkWatch system at {selectedLocationName}. Darkened spots are already booked.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 aspect-[4/3] max-w-xs mx-auto">
          {SPOTS_LAYOUT.flat().map((spotId) => {
            const isBooked = bookedSpotsForCurrentLocation.includes(spotId);
            const isSelected = selectedSpot === spotId;

            return (
              <Button
                key={spotId}
                variant={isSelected && !isBooked ? 'default' : 'outline'}
                onClick={() => onSpotSelect(spotId)}
                className={`aspect-square text-lg font-semibold w-full h-full p-0 transition-all
                  ${isBooked ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 cursor-not-allowed' : ''}
                  ${isSelected && !isBooked ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                aria-label={isBooked ? `Spot ${spotId} (Booked)` : `Select spot ${spotId}`}
                aria-pressed={isSelected && !isBooked}
                disabled={isBooked}
              >
                {spotId}
              </Button>
            );
          })}
        </div>
        {selectedSpot && !bookedSpotsForCurrentLocation.includes(selectedSpot) && (
          <div className="mt-4 p-3 bg-secondary rounded-lg shadow text-center">
            <p className="text-sm text-secondary-foreground">
              Selected Spot: <strong>{selectedSpot}</strong>
            </p>
          </div>
        )}
         {selectedSpot && bookedSpotsForCurrentLocation.includes(selectedSpot) && (
          <div className="mt-4 p-3 bg-destructive/20 border border-destructive rounded-lg shadow text-center">
            <p className="text-sm text-destructive-foreground">
              Spot <strong>{selectedSpot}</strong> is booked. Please select another spot.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
