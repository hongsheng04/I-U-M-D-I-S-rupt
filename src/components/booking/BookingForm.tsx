
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Car, MapPin } from 'lucide-react';
import type { BookingDetails, Location } from '@/types';

const bookingFormSchema = z.object({
  duration: z.coerce.number().min(1, "Duration must be at least 1 hour").max(24, "Duration cannot exceed 24 hours"),
  vehiclePlate: z.string().min(3, "Vehicle plate must be at least 3 characters").max(10, "Vehicle plate is too long"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  selectedLocation: Location; // Now required
  selectedSpot: string; // Now required
  onSubmit: (data: Pick<BookingDetails, 'duration' | 'vehiclePlate'>) => void;
  isLoading: boolean;
}

export function BookingForm({ selectedLocation, selectedSpot, onSubmit, isLoading }: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      duration: 1,
      vehiclePlate: '',
    },
  });

  const handleSubmit = (values: BookingFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="text-primary" /> Booking Details</CardTitle>
        <CardDescription>Specify your parking duration and vehicle information for spot <strong className="text-primary">{selectedSpot}</strong> at <strong className="text-primary">{selectedLocation.name}</strong>.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Duration (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} className="bg-background"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehiclePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Vehicle Plate Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ABC-123" {...field} className="bg-background"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4 bg-secondary rounded-lg shadow">
              <p className="text-sm text-secondary-foreground">
                You are booking spot: <strong className="text-primary">{selectedSpot}</strong> at {selectedLocation.name}.
              </p>
              <p className="text-sm text-secondary-foreground mt-1">
                Estimated Price: RM{ (form.watch('duration') * selectedLocation.hourlyRate).toFixed(2) } 
                {" "}for {form.watch('duration')} hour(s).
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
              <Car className="ml-2" size={20}/>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
