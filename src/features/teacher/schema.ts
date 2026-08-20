import { z } from "zod";

export const courseDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),
});

export const lectureSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  sourceUrl: z.url("Please enter a valid URL."),
});

export type CourseDescriptionInput = z.infer<typeof courseDescriptionSchema>;
export type LectureInput = z.infer<typeof lectureSchema>;
