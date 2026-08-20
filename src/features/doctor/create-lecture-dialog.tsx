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
  doctorFieldTextarea,
  doctorVideoPreview,
} from "./form-ui";
import {
  lectureCreateSchema,
  type LectureCreateInput,
} from "./schema";
import { getYouTubeEmbedUrl } from "./youtube";

export function CreateLectureDialog({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<LectureCreateInput>({
    resolver: zodResolver(lectureCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      sourceUrl: "",
    },
  });

  const embedUrl = getYouTubeEmbedUrl(form.watch("sourceUrl") || "");

  async function onSubmit(values: LectureCreateInput) {
    try {
      await api.post(`/doctor/courses/${courseId}/lectures`, values);
      toast.success("Lecture added.");
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to add lecture.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={doctorActionButton}>Add lecture</Button>
      </DialogTrigger>
      <DialogContent className={doctorDialogContent}>
        <DialogHeader className="space-y-2">
          <DialogTitle className={doctorDialogTitle}>Add lecture</DialogTitle>
          <DialogDescription>
            Add a lecture with a description and source URL (YouTube or link).
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="lecture-title" className="text-sm font-semibold">
              Title
            </Label>
            <Input
              id="lecture-title"
              className={doctorFieldInput}
              {...form.register("title")}
              aria-invalid={Boolean(form.formState.errors.title)}
            />
            {form.formState.errors.title ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lecture-description"
              className="text-sm font-semibold"
            >
              Description
            </Label>
            <Textarea
              id="lecture-description"
              className={doctorFieldTextarea}
              rows={4}
              {...form.register("description")}
              aria-invalid={Boolean(form.formState.errors.description)}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lecture-url" className="text-sm font-semibold">
              Source URL
            </Label>
            <Input
              id="lecture-url"
              type="url"
              className={doctorFieldInput}
              placeholder="https://www.youtube.com/watch?v=..."
              {...form.register("sourceUrl")}
              aria-invalid={Boolean(form.formState.errors.sourceUrl)}
            />
            {form.formState.errors.sourceUrl ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.sourceUrl.message}
              </p>
            ) : null}
          </div>
          {embedUrl ? (
            <div className={doctorVideoPreview}>
              <iframe
                title="YouTube preview"
                src={embedUrl}
                className="aspect-video h-auto max-h-48 w-full"
                allowFullScreen
              />
            </div>
          ) : null}
          <div className="flex justify-end gap-3 pt-2">
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
              {form.formState.isSubmitting ? "Saving..." : "Add lecture"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
