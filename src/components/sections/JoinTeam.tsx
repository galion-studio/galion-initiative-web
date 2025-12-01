'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinTeamSchema, JoinTeamValues } from '@/lib/validations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

export default function JoinTeam() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JoinTeamValues>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      name: "",
      email: "",
      expertise: undefined,
      message: "",
    },
  });

  async function onSubmit(data: JoinTeamValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast.success("Application Received", {
        description: "We'll be in touch if your profile matches our needs."
      });
      trackEvent('join_team_submit', { expertise: data.expertise });
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const expertiseOptions = [
    "AI/ML Research",
    "Safety & Alignment",
    "Software Engineering",
    "Systems Architecture",
    "Philosophy & Ethics",
    "Policy & Governance",
    "Institutional Relations",
    "Other"
  ];

  const roles = [
    "AI Safety & Alignment Research",
    "Symbolic Reasoning & Formal Verification",
    "Systems Architecture & Distributed Computing",
    "Ethics, Philosophy & Policy",
    "Governance & Institutional Design"
  ];

  return (
    <section id="join-team" className="py-20 sm:py-24 md:py-32 bg-neutral-950 text-neutral-50 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Context */}
          <div className="pt-4 sm:pt-8 text-center lg:text-left">
            <span className="text-primary-400 font-bold tracking-widest uppercase text-xs mb-4 block">
              Recruitment
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Join the Mission
            </h2>
            <p className="text-lg sm:text-xl text-neutral-400 mb-8 sm:mb-12 font-light leading-relaxed">
              We are assembling a task force of exceptional minds to solve the most critical engineering challenge in human history.
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              {roles.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 group"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-900/10 transition-colors flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                  </div>
                  <span className="text-base sm:text-lg text-neutral-300 group-hover:text-white transition-colors">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-neutral-400 italic">
                    "If you're committed to ensuring superintelligence benefits all humanity—let's talk."
                </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            {/* Form Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-900/20 rounded-2xl blur opacity-50" />
            
            <div className="relative bg-neutral-950/80 backdrop-blur-xl p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl border border-neutral-800 shadow-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-neutral-400 text-xs uppercase tracking-wider">Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Jane Doe" 
                                    {...field} 
                                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-primary-500/50 focus:ring-primary-500/20 h-11 sm:h-12 text-sm sm:text-base"
                                />
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
                            <FormLabel className="text-neutral-400 text-xs uppercase tracking-wider">Email</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="jane@example.com" 
                                    {...field} 
                                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-primary-500/50 focus:ring-primary-500/20 h-11 sm:h-12 text-sm sm:text-base"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-400 text-xs uppercase tracking-wider">Area of Expertise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-white focus:border-primary-500/50 focus:ring-primary-500/20 h-11 sm:h-12 text-sm sm:text-base">
                                <SelectValue placeholder="Select your domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                              {expertiseOptions.map(opt => (
                                <SelectItem key={opt} value={opt} className="focus:bg-neutral-800 focus:text-white cursor-pointer">{opt}</SelectItem>
                              ))}
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
                          <FormLabel className="text-neutral-400 text-xs uppercase tracking-wider">Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your work..." 
                              className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-primary-500/50 focus:ring-primary-500/20 min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base" 
                              maxLength={500}
                              {...field} 
                            />
                          </FormControl>
                          <div className="text-[10px] text-right text-neutral-600 font-mono">
                            {field.value?.length || 0}/500
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white text-base sm:text-lg h-12 sm:h-14 rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all touch-manipulation" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Application <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-neutral-600">
                    Your data is secure and encrypted. We respect your privacy.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
