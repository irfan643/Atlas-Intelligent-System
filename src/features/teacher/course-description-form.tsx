"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { updateCourseDescription } from "./actions";
import {
  courseDescriptionSchema,
  type CourseDescriptionInput,
} from "./schema";

export function CourseDescriptionForm({
  courseId,
  description,
}: {
  courseId: string;
  description: string;
}) {
  const router = useRouter();
  const form = useForm<CourseDescriptionInput>({
    resolver: zodResolver(courseDescriptionSchema),
    defaultValues: { description },
  });

  async function onSubmit(values: CourseDescriptionInput) {
    const result = await updateCourseDescription(courseId, values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Course description saved.");
    router.refresh();
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="course-description">Course description</Label>
        <Textarea
          id="course-description"
          rows={4}
          className="resize-y"
          aria-invalid={Boolean(form.formState.errors.description)}
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save description"}
      </Button>
    </form>
  );
}
