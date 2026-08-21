"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api/client";

import {
  doctorActionButton,
  doctorDialogContent,
  doctorDialogTitle,
  doctorFieldInput,
  doctorFieldTextarea,
} from "./form-ui";
import {
  courseUpdateSchema,
  type CourseUpdateInput,
} from "./schema";

export function EditCourseDialog({
  course,
}: {
  course: {
    id: string;
    title: string;
    description: string;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<CourseUpdateInput>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: course.title,
        description: course.description,
      });
    }
  }, [open, course.title, course.description, form]);

  async function onSubmit(values: CourseUpdateInput) {
    try {
      await api.patch(`/doctor/courses/${course.id}`, values);
      toast.success("Course updated.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to update course.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={doctorActionButton}>
          <Pencil />
          Edit course
        </Button>
      </DialogTrigger>
      <DialogContent className={doctorDialogContent}>
        <DialogHeader className="space-y-1.5">
          <DialogTitle className={doctorDialogTitle}>Edit course</DialogTitle>
          <DialogDescription>
            Update the title and description for this course.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="edit-course-title" className="text-sm font-semibold">
              Title
            </Label>
            <Input
              id="edit-course-title"
              className={doctorFieldInput}
              aria-invalid={Boolean(form.formState.errors.title)}
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-course-description"
              className="text-sm font-semibold"
            >
              Description
            </Label>
            <Textarea
              id="edit-course-description"
              className={doctorFieldTextarea}
              rows={4}
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className={doctorActionButton}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={doctorActionButton}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
