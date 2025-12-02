'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, NewsletterValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      consent: false,
      honeypot: "",
    },
  });

  async function onSubmit(data: NewsletterValues) {
    if (data.honeypot) return; // Silent reject

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show the actual error message from the server if available
        const errorMessage = result.error || 'Failed to subscribe';
        throw new Error(errorMessage);
      }

      toast.success("Subscribed successfully! Thank you for joining our newsletter.");
      trackEvent('newsletter_subscribe', { location: 'footer' });
      form.reset();
    } catch (error) {
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-neutral-950 text-neutral-50 border-t border-neutral-900">
      <div className="container px-4 md:px-6 mx-auto max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Stay Updated</h2>
        <p className="text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8 px-2">
          Get monthly updates on breakthrough research, AI safety developments, and progress toward safe superintelligence.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input 
              {...form.register('email')} 
              placeholder="your@email.com" 
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 h-11 sm:h-12 text-sm sm:text-base"
              aria-label="Email address"
            />
            {/* Honeypot */}
            <input 
              type="text" 
              {...form.register('honeypot')} 
              className="hidden" 
              tabIndex={-1} 
              autoComplete="off"
            />
            <Button type="submit" className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base touch-manipulation min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Subscribe →
            </Button>
          </div>
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs sm:text-sm text-left">{form.formState.errors.email.message}</p>
          )}

          <div className="flex items-start justify-center gap-2 text-xs sm:text-sm text-neutral-500 px-2">
            <input 
              type="checkbox" 
              id="consent"
              {...form.register('consent')}
              className="rounded border-neutral-700 bg-neutral-900 text-primary-500 focus:ring-primary-900 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 touch-manipulation"
            />
            <label htmlFor="consent" className="cursor-pointer text-left">
              I agree to receive updates from The Galion Initiative
            </label>
          </div>
          {form.formState.errors.consent && (
             <p className="text-red-500 text-xs sm:text-sm">{form.formState.errors.consent.message}</p>
          )}

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-neutral-600 pt-4 px-2">
            <span className="flex items-center gap-1">✓ No spam, ever</span>
            <span className="flex items-center gap-1">✓ Unsubscribe anytime</span>
            <span className="flex items-center gap-1">✓ ~1 email per month</span>
          </div>
        </form>
      </div>
    </section>
  );
}

