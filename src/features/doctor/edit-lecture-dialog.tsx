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
  doctorVideoPreview,
} from "./form-ui";
import {
  lectureUpdateSchema,
  type LectureUpdateInput,
} from "./schema";
import { getYouTubeEmbedUrl } from "./youtube";

export function EditLectureDialog({
  lecture,
}: {
  lecture: {
    id: string;
    title: string;
    description: string;
    sourceUrl: string;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<LectureUpdateInput>({
    resolver: zodResolver(lectureUpdateSchema),
    defaultValues: {
      title: lecture.title,
      description: lecture.description,
      sourceUrl: lecture.sourceUrl,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: lecture.title,
        description: lecture.description,
        sourceUrl: lecture.sourceUrl,
      });
    }
  }, [open, lecture, form]);

  const embedUrl = getYouTubeEmbedUrl(form.watch("sourceUrl") || "");

  async function onSubmit(values: LectureUpdateInput) {
    try {
      await api.patch(`/doctor/lectures/${lecture.id}`, values);
      toast.success("Lecture updated.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to update lecture.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={doctorActionButton}>
          <Pencil />
          Edit lecture
        </Button>
      </DialogTrigger>
      <DialogContent className={doctorDialogContent}>
        <DialogHeader className="space-y-1.5">
          <DialogTitle className={doctorDialogTitle}>Edit lecture</DialogTitle>
          <DialogDescription>
            Update the title, description, and source URL.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-lecture-title-${lecture.id}`} className="text-sm font-semibold">
              Title
            </Label>
            <Input
              id={`edit-lecture-title-${lecture.id}`}
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
          <div className="space-y-1.5">
            <Label
              htmlFor={`edit-lecture-description-${lecture.id}`}
              className="text-sm font-semibold"
            >
              Description
            </Label>
            <Textarea
              id={`edit-lecture-description-${lecture.id}`}
              className={doctorFieldTextarea}
              rows={3}
              {...form.register("description")}
              aria-invalid={Boolean(form.formState.errors.description)}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor={`edit-lecture-url-${lecture.id}`}
              className="text-sm font-semibold"
            >
              Source URL
            </Label>
            <Input
              id={`edit-lecture-url-${lecture.id}`}
              type="url"
              className={doctorFieldInput}
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
                className="aspect-video h-auto max-h-40 w-full"
                allowFullScreen
              />
            </div>
          ) : null}
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
