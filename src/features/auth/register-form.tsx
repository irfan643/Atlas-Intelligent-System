"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";

import { AuthPasswordField } from "./auth-password-field";
import { registerSchema, type PublicUser, type RegisterInput } from "./schema";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      const { data } = await api.post<{ user: PublicUser }>(
        "/auth/register",
        values,
      );
      toast.success(`Account created for ${data.user.name}.`);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to create the account.");
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 font-sans text-foreground shadow-[0_26px_70px_#31527914]">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm leading-6 font-normal text-muted-foreground">
          Register to open your doctor workspace and manage your own courses.
        </p>
      </div>
      <form className="mt-5 space-y-3.5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="register-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="register-name"
              className="h-11 rounded-md bg-background px-3.5 text-sm"
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-sm leading-5 font-normal text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="register-email"
              type="email"
              className="h-11 rounded-md bg-background px-3.5 text-sm"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm leading-5 font-normal text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
        </div>
        <AuthPasswordField
          id="register-password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        <AuthPasswordField
          id="register-confirm"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />
        <Button
          type="submit"
          className="h-11 w-full rounded-md text-sm font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm leading-6 font-normal text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
