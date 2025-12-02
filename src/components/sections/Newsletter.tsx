'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, NewsletterValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      consent: true, // Automatically set to true
      honeypot: "",
    },
  });

  async function onSubmit(data: NewsletterValues) {
    if (data.honeypot) {
      trackEvent('newsletter_spam_attempt', { location: 'footer' });
      return; // Silent reject
    }

    setIsSubmitting(true);
    trackEvent('newsletter_submit_attempt', { location: 'footer' });
    try {
      // Automatically set consent to true when submitting
      const submitData = { ...data, consent: true };
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Try to get text to see what we got
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid response. Please try again later.');
      }

      // Check if response body is empty
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error('Empty response from server. Please check your Cloudflare Functions setup.');
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text);
        throw new Error('Invalid response format. Please try again later.');
      }

      if (!response.ok) {
        // Show the actual error message from the server if available
        const errorMessage = result.error || 'Failed to subscribe';
        throw new Error(errorMessage);
      }

      toast.success("Subscribed successfully! Thank you for joining our newsletter.");
      trackEvent('newsletter_subscribe', { location: 'footer', success: true });
      trackEvent('newsletter_subscribe_success', { location: 'footer' });
      form.reset();
    } catch (error) {
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
      trackEvent('newsletter_subscribe_error', { location: 'footer', error: errorMessage });
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-20 sm:py-24 md:py-28 bg-neutral-950 text-neutral-50 relative overflow-hidden">
      {/* Subtle background variation for visual interest */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-neutral-950 to-neutral-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] pointer-events-none" />
      
      <div className="container px-4 md:px-6 mx-auto max-w-2xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
          >
            Stay Updated
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8 px-2"
          >
            Get monthly updates on breakthrough research, AI safety developments, and progress toward safe superintelligence.
          </motion.p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-4"
        >
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

          <p className="text-xs sm:text-sm text-neutral-500 px-2 text-center">
            By clicking "Subscribe", I agree to receive updates from The Galion Initiative
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-neutral-600 pt-4 px-2">
            <span className="flex items-center gap-1">✓ No spam, ever</span>
            <span className="flex items-center gap-1">✓ Unsubscribe anytime</span>
            <span className="flex items-center gap-1">✓ ~1 email per month</span>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

