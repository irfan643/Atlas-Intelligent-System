"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";

import { AuthPasswordField } from "@/features/auth/auth-password-field";

import {
  doctorActionButton,
  doctorFieldInput,
  doctorPageTitle,
} from "./form-ui";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "./schema";

export function DoctorProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name,
      email,
      password: "",
    },
  });

  async function onSubmit(values: ProfileUpdateInput) {
    try {
      await api.patch("/doctor/profile", {
        name: values.name,
        email: values.email,
        password: values.password || undefined,
      });
      toast.success("Profile updated.");
      form.setValue("password", "");
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to update profile.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-stretch py-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className={doctorPageTitle}>Profile</h1>
        <p className="text-base text-muted-foreground">
          Update your doctor account details.
        </p>
      </div>
      <form
        className="w-full space-y-5 rounded-md border bg-card p-6 sm:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="profile-name" className="text-sm font-semibold">
            Name
          </Label>
          <Input
            id="profile-name"
            className={doctorFieldInput}
            {...form.register("name")}
            aria-invalid={Boolean(form.formState.errors.name)}
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email" className="text-sm font-semibold">
            Email
          </Label>
          <Input
            id="profile-email"
            type="email"
            className={doctorFieldInput}
            {...form.register("email")}
            aria-invalid={Boolean(form.formState.errors.email)}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <AuthPasswordField
          id="profile-password"
          label="New password (optional)"
          autoComplete="new-password"
          className={doctorFieldInput}
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        <Button
          type="submit"
          className={`w-full ${doctorActionButton}`}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </div>
  );
}
