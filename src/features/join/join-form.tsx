"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthPasswordField } from "@/features/auth/auth-password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";

type InviteInfo = {
  courseId: string;
  courseTitle: string;
  email: string;
};

export function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInvite() {
      if (!token) {
        setError("Missing invite token.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get<{ invite: InviteInfo }>("/join", {
          params: { token },
        });
        if (!cancelled) {
          setInvite(data.invite);
          setError(null);
        }
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error
          : undefined;
        if (!cancelled) {
          setError(message ?? "This invite link is invalid or has expired.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInvite();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSubmitting(true);
    try {
      await api.post("/join", { token, name, password });
      toast.success("You're enrolled. Sign in with your new account.");
      router.replace("/login?joined=1");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : undefined;
      toast.error(message ?? "Unable to join the course.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground shadow-[0_26px_70px_#31527914]">
        Checking invite…
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="rounded-lg border bg-card p-4 font-sans text-foreground shadow-[0_26px_70px_#31527914]">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Invite unavailable
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error ?? "This invite link is invalid or has expired."}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 font-sans text-foreground shadow-[0_26px_70px_#31527914]">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
          Join course
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Create your student account to join{" "}
          <span className="font-medium text-foreground">{invite.courseTitle}</span>.
        </p>
      </div>

      <form className="mt-5 space-y-3.5" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="join-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="join-email"
            type="email"
            value={invite.email}
            readOnly
            className="h-11 rounded-md bg-muted px-3.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="join-name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="join-name"
            className="h-11 rounded-md bg-background px-3.5 text-sm"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
          />
        </div>
        <AuthPasswordField
          id="join-password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
        <Button
          type="submit"
          className="h-11 w-full rounded-md text-sm font-medium"
          disabled={submitting}
        >
          {submitting ? "Joining..." : "Join course"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
