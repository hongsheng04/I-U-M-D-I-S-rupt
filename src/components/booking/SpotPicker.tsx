
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3 } from 'lucide-react';

interface SpotPickerProps {
  selectedLocationName: string;
  selectedSpot: string | null;
  onSpotSelect: (spot: string) => void;
}

const SPOTS_LAYOUT: string[][] = [
  ['A1', 'A2', 'A3'],
  ['B1', 'B2', 'B3'],
  ['C1', 'C2', 'C3'],
];

export function SpotPicker({ selectedLocationName, selectedSpot, onSpotSelect }: SpotPickerProps) {
  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="text-primary" /> Select Your Spot at {selectedLocationName}
        </CardTitle>
        <CardDescription>Choose an available spot. This grid reflects the current layout and availability from the ParkWatch system at {selectedLocationName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 aspect-[4/3] max-w-xs mx-auto">
          {SPOTS_LAYOUT.flat().map((spotId) => (
            <Button
              key={spotId}
              variant={selectedSpot === spotId ? 'default' : 'outline'}
              onClick={() => onSpotSelect(spotId)}
              className="aspect-square text-lg font-semibold w-full h-full p-0"
              aria-label={`Select spot ${spotId}`}
              aria-pressed={selectedSpot === spotId}
            >
              {spotId}
            </Button>
          ))}
        </div>
        {selectedSpot && (
          <div className="mt-4 p-3 bg-secondary rounded-lg shadow text-center">
            <p className="text-sm text-secondary-foreground">
              Selected Spot: <strong>{selectedSpot}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
