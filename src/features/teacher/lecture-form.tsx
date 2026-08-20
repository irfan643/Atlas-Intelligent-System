"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createLecture, updateLecture } from "./actions";
import { lectureSchema, type LectureInput } from "./schema";
import { getYouTubeEmbedUrl } from "./youtube";

export function LectureForm({
  courseId,
  lecture,
}: {
  courseId: string;
  lecture?: {
    id: string;
    title: string;
    description: string;
    sourceUrl: string;
  };
}) {
  const router = useRouter();
  const form = useForm<LectureInput>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: lecture?.title ?? "",
      description: lecture?.description ?? "",
      sourceUrl: lecture?.sourceUrl ?? "",
    },
  });

  const watchedUrl = form.watch("sourceUrl");
  const embedUrl = watchedUrl ? getYouTubeEmbedUrl(watchedUrl) : null;

  async function onSubmit(values: LectureInput) {
    const result = lecture
      ? await updateLecture(courseId, lecture.id, values)
      : await createLecture(courseId, values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(lecture ? "Lecture updated." : "Lecture added.");
    if (!lecture) {
      form.reset({ title: "", description: "", sourceUrl: "" });
    }
    router.refresh();
  }

  return (
    <form className="space-y-3.5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor={`lecture-title-${lecture?.id ?? "new"}`}>Title</Label>
        <Input
          id={`lecture-title-${lecture?.id ?? "new"}`}
          placeholder="Lecture title"
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
        <Label htmlFor={`lecture-description-${lecture?.id ?? "new"}`}>
          Description
        </Label>
        <Textarea
          id={`lecture-description-${lecture?.id ?? "new"}`}
          rows={3}
          placeholder="What this lecture covers"
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
        <Label htmlFor={`lecture-url-${lecture?.id ?? "new"}`}>
          Source URL
        </Label>
        <Input
          id={`lecture-url-${lecture?.id ?? "new"}`}
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          aria-invalid={Boolean(form.formState.errors.sourceUrl)}
          {...form.register("sourceUrl")}
        />
        {form.formState.errors.sourceUrl ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.sourceUrl.message}
          </p>
        ) : null}
      </div>

      {embedUrl ? (
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <iframe
            title="YouTube preview"
            src={embedUrl}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting
          ? "Saving..."
          : lecture
            ? "Update lecture"
            : "Add lecture"}
      </Button>
    </form>
  );
}
