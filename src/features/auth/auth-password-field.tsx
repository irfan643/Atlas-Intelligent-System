"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthPasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof Input>, "id" | "type" | "className">;

export function AuthPasswordField({
  id,
  label,
  error,
  autoComplete,
  placeholder = "••••••••",
  ...props
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="h-11 rounded-md bg-background pr-11 pl-3.5 text-sm"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error ? (
        <p className={cn("text-sm leading-5 font-normal text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
}
