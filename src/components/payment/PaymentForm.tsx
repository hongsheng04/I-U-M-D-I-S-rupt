"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardHolderName: z.string().min(2, "Card holder name is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  isLoading: boolean;
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: '',
    },
  });

  return (
    <Card className="shadow-lg max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary"/> Secure Payment</CardTitle>
        <CardDescription>Enter your card details to complete the booking.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Card Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-background"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="•••• •••• •••• ••••" {...field} className="bg-background"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-foreground">Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} className="bg-background"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-foreground">CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="•••" {...field} className="bg-background"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={isLoading}>
              {isLoading ? 'Processing Payment...' : 'Pay and Confirm Booking'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
