"use client";

import axios from "axios";
import { FilePenLine, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";

import { doctorActionButton } from "./form-ui";

export function CourseStatusToggle({
  courseId,
  status,
}: {
  courseId: string;
  status: "DRAFT" | "PUBLISHED";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const nextStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  function onToggle() {
    startTransition(async () => {
      try {
        await api.patch(`/doctor/courses/${courseId}/status`, {
          status: nextStatus,
        });
        toast.success(
          nextStatus === "PUBLISHED"
            ? "Course published."
            : "Course moved to draft.",
        );
        router.refresh();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { error?: string } | undefined)?.error
          : undefined;
        toast.error(message ?? "Unable to update status.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={doctorActionButton}
      disabled={pending}
      onClick={onToggle}
    >
      {pending ? (
        "Updating..."
      ) : status === "PUBLISHED" ? (
        <>
          <FilePenLine />
          Set to draft
        </>
      ) : (
        <>
          <Globe />
          Publish
        </>
      )}
    </Button>
  );
}
