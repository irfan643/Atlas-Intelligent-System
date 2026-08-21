"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  doctorFieldSelect,
  doctorFieldTextarea,
} from "./form-ui";
import {
  courseCreateSchema,
  type CourseCreateInput,
} from "./schema";

export function CreateCourseDialog({
  triggerLabel = "Add course",
}: {
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<CourseCreateInput>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "DRAFT",
    },
  });

  async function onSubmit(values: CourseCreateInput) {
    try {
      await api.post("/doctor/courses", values);
      toast.success("Course created.");
      form.reset({ title: "", description: "", status: "DRAFT" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to create course.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={doctorActionButton}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className={doctorDialogContent}>
        <DialogHeader className="space-y-1.5">
          <DialogTitle className={doctorDialogTitle}>Create course</DialogTitle>
          <DialogDescription>
            Add a new course you own. You can edit details and status later.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="course-title" className="text-sm font-semibold">
              Title
            </Label>
            <Input
              id="course-title"
              className={doctorFieldInput}
              placeholder="Course title"
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
            <Label htmlFor="course-description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="course-description"
              className={doctorFieldTextarea}
              rows={4}
              placeholder="What this course covers"
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="course-status" className="text-sm font-semibold">
              Status
            </Label>
            <select
              id="course-status"
              className={doctorFieldSelect}
              {...form.register("status")}
            >
              <option value="DRAFT">Draft (pending)</option>
              <option value="PUBLISHED">Published</option>
            </select>
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
              {form.formState.isSubmitting ? "Creating..." : "Create course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
