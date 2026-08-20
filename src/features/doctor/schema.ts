import { z } from "zod";

export const courseCreateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const courseUpdateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),
});

export const courseStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const lectureCreateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  sourceUrl: z.url("Please enter a valid URL."),
});

export const lectureUpdateSchema = lectureCreateSchema;

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email."),
  password: z.union([
    z.literal(""),
    z.string().min(8, "Password must be at least 8 characters."),
  ]),
});

export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type CourseStatusInput = z.infer<typeof courseStatusSchema>;
export type LectureCreateInput = z.infer<typeof lectureCreateSchema>;
export type LectureUpdateInput = z.infer<typeof lectureUpdateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
