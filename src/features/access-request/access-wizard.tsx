"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { requestAccessAction } from "./actions";
import {
  accessPurposes,
  requestAccessSchema,
  requestDetailsSchema,
  type AccessPurpose,
  type RequestAccessInput,
  type RequestDetails,
} from "./schema";

const steps = [1, 2, 3] as const;

export function AccessWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [purpose, setPurpose] = useState<AccessPurpose | "">("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const detailsForm = useForm<RequestDetails>({
    resolver: zodResolver(requestDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      purpose: "Investor preview",
    },
  });

  const submitForm = useForm<RequestAccessInput>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      email: "",
      purpose: "Investor preview",
      agree: false,
    },
  });
  const agree = useWatch({
    control: submitForm.control,
    name: "agree",
  });

  function choosePurpose(value: AccessPurpose) {
    setPurpose(value);
    detailsForm.setValue("purpose", value);
    setStep(2);
  }

  function continueToNda(values: RequestDetails) {
    submitForm.reset({
      ...values,
      agree: false,
    });
    setStep(3);
  }

  function onSubmit(values: RequestAccessInput) {
    startTransition(async () => {
      const response = await requestAccessAction(values);

      if (!response.ok) {
        toast.error(response.error);
        return;
      }

      setResult(response.message);
      toast.success("Access request recorded");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {steps.map((item) => (
          <div
            key={item}
            className={cn(
              "h-1.5 flex-1 rounded-lg bg-border",
              item <= step && "bg-primary",
            )}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-violet">
            Atlas access
          </p>
          <div className="space-y-2">
            <h2 className="font-heading text-3xl tracking-tight">
              What brings you to Atlas?
            </h2>
            <p className="text-muted-foreground">
              Select the experience that best matches your request.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {accessPurposes.map((choice) => (
              <button
                key={choice.value}
                type="button"
                className="min-h-[110px] rounded-xl border border-border bg-muted p-4 text-left transition-colors hover:border-primary"
                onClick={() => choosePurpose(choice.value)}
              >
                <strong className="block text-base">{choice.title}</strong>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {choice.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <form
          className="space-y-4"
          onSubmit={detailsForm.handleSubmit(continueToNda)}
        >
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-violet">
            Request details
          </p>
          <h2 className="font-heading text-3xl tracking-tight">
            Tell us where to send your secure invitation.
          </h2>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="h-12 px-3.5"
              placeholder="Your name"
              {...detailsForm.register("name")}
            />
            {detailsForm.formState.errors.name ? (
              <p className="text-sm text-destructive">
                {detailsForm.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="h-12 px-3.5"
              placeholder="you@example.com"
              {...detailsForm.register("email")}
            />
            {detailsForm.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {detailsForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Requested access</Label>
            <Input
              id="purpose"
              className="h-12 px-3.5"
              readOnly
              value={purpose}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="h-12 px-5 font-bold">
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-5 font-bold"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form className="space-y-4" onSubmit={submitForm.handleSubmit(onSubmit)}>
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-violet">
            Confidential preview
          </p>
          <h2 className="font-heading text-3xl tracking-tight">
            Confidentiality acknowledgment
          </h2>
          <div className="rounded-xl bg-accent p-3.5 text-accent-foreground">
            This preview may contain non-public business, product, and
            educational information. A final NDA should be reviewed and signed
            through your approved legal and e-signature workflow before
            confidential materials are released.
          </div>
          <label className="flex items-start gap-3 text-sm font-semibold">
            <Checkbox
              checked={agree}
              onCheckedChange={(checked) =>
                submitForm.setValue("agree", checked === true, {
                  shouldValidate: true,
                })
              }
            />
            <span>I understand and request confidential preview access.</span>
          </label>
          {submitForm.formState.errors.agree ? (
            <p className="text-sm text-destructive">
              {submitForm.formState.errors.agree.message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="h-12 px-5 font-bold"
              disabled={isPending}
            >
              Request secure invitation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-5 font-bold"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
          </div>
          {result ? (
            <p className="text-sm text-muted-foreground">{result}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
