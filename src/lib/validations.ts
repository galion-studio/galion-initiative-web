import { z } from "zod";

export const joinTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  expertise: z.enum([
    "AI/ML Research",
    "Safety & Alignment",
    "Software Engineering",
    "Systems Architecture",
    "Philosophy & Ethics",
    "Policy & Governance",
    "Institutional Relations",
    "Other"
  ], {
    message: "Please select an expertise",
  }),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
});

export type JoinTeamValues = z.infer<typeof joinTeamSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  honeypot: z.string().optional(),
  consent: z.boolean(), // Always set to true when subscribing (no validation needed)
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

