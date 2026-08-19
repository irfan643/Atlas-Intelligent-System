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
import { loginSchema, type LoginInput, type PublicUser } from "./schema";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      const { data } = await api.post<{ user: PublicUser }>("/auth/login", values);
      toast.success(`Welcome back, ${data.user.name}.`);
      router.push("/dashboard");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to sign in.");
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 font-sans text-foreground shadow-[0_26px_70px_#31527914]">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm leading-6 font-normal text-muted-foreground">
          Sign in to continue to Learning and Production.
        </p>
      </div>
      <form className="mt-5 space-y-3.5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="login-email"
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
        <AuthPasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        <Button
          type="submit"
          className="h-11 w-full rounded-md text-sm font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Continue"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm leading-6 font-normal text-muted-foreground">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
