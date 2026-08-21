"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { UserPlus } from "lucide-react";
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
import { api } from "@/lib/api/client";

import {
  doctorActionButton,
  doctorDialogContent,
  doctorDialogTitle,
  doctorFieldInput,
} from "./form-ui";
import {
  courseInviteSchema,
  type CourseInviteInput,
} from "./schema";

export function InviteStudentDialog({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const form = useForm<CourseInviteInput>({
    resolver: zodResolver(courseInviteSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: CourseInviteInput) {
    try {
      const { data } = await api.post<{
        ok: boolean;
        joinUrl: string;
        emailSent: boolean;
        mailError?: string;
      }>(`/doctor/courses/${courseId}/invite`, values);

      if (data.emailSent) {
        toast.success("Invite email sent.");
        form.reset({ email: "" });
        setJoinUrl(null);
        setOpen(false);
        return;
      }

      // Only show the join link when email could not be delivered.
      setJoinUrl(data.joinUrl);
      toast.message(
        data.mailError
          ? "Email could not be sent. Copy the join link below."
          : "Copy the join link below to share the invite.",
      );
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to send invite.");
    }
  }

  async function copyJoinUrl() {
    if (!joinUrl) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success("Join link copied.");
    } catch {
      toast.error("Unable to copy link.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setJoinUrl(null);
          form.reset({ email: "" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={doctorActionButton}>
          <UserPlus />
          Invite student
        </Button>
      </DialogTrigger>
      <DialogContent className={doctorDialogContent}>
        <DialogHeader className="space-y-1.5">
          <DialogTitle className={doctorDialogTitle}>Invite student</DialogTitle>
          <DialogDescription>
            Send an invite email for this course. Students open the email to
            create their account.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email" className="text-sm font-semibold">
              Student email
            </Label>
            <Input
              id="invite-email"
              type="email"
              className={doctorFieldInput}
              placeholder="student@example.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          {joinUrl ? (
            <div className="space-y-2 rounded-md border bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Join link
              </p>
              <p className="text-sm break-all">{joinUrl}</p>
              <Button
                type="button"
                variant="outline"
                className={doctorActionButton}
                onClick={copyJoinUrl}
              >
                Copy link
              </Button>
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
              {form.formState.isSubmitting ? "Sending..." : "Send invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
