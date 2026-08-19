import { z } from "zod";

export const accessPurposes = [
  {
    value: "Investor preview",
    title: "Investor preview",
    description: "Review a private overview and approved materials.",
  },
  {
    value: "Learning access",
    title: "Learning access",
    description: "Explore courses and approved learning tools.",
  },
  {
    value: "School or hospital",
    title: "Organization access",
    description: "Discuss a private organization solution.",
  },
  {
    value: "Partnership",
    title: "Partnership",
    description: "Explore collaboration opportunities.",
  },
] as const;

export const accessPurposeSchema = z.enum([
  "Investor preview",
  "Learning access",
  "School or hospital",
  "Partnership",
]);

export const requestDetailsSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.email("Please enter a valid email."),
  purpose: accessPurposeSchema,
});

export const requestAccessSchema = requestDetailsSchema.extend({
  agree: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please acknowledge the confidentiality notice.",
    }),
});

export type RequestDetails = z.infer<typeof requestDetailsSchema>;
export type RequestAccessInput = z.infer<typeof requestAccessSchema>;
export type AccessPurpose = z.infer<typeof accessPurposeSchema>;
