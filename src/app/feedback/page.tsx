
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, Send, CheckCircle } from 'lucide-react';

const feedbackFormSchema = z.object({
  name: z.string().max(50, "Name is too long").optional(),
  email: z.string().email({ message: "Invalid email address" }).max(100, "Email is too long").optional().or(z.literal("")),
  feedbackType: z.enum(["bug", "suggestion", "general"], {
    required_error: "Please select a feedback type.",
  }),
  message: z.string()
    .min(10, "Feedback message must be at least 10 characters long.")
    .max(1000, "Feedback message cannot exceed 1000 characters."),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsLoading(true);
    console.log("Feedback submitted:", data); // In a real app, send this to a backend

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmittedSuccessfully(true);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback.",
    });
    form.reset(); 
  };

  if (isSubmittedSuccessfully) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto text-center py-10">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Thank You!</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your feedback has been successfully submitted. We appreciate you taking the time to help us improve.
          </p>
        </div>
        <Button onClick={() => setIsSubmittedSuccessfully(false)} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          Submit More Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="text-primary" /> Provide Your Feedback
          </CardTitle>
          <CardDescription>
            We value your input! Let us know what you think or if you've encountered any issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} className="bg-background" />
                    </FormControl>
                    <FormDescription>
                      If you'd like a response or follow-up.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedbackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Feedback Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select a feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                        <SelectItem value="general">General Comment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Feedback Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more..."
                        className="resize-y min-h-[100px] bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
                <Send className="ml-2" size={20}/>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
