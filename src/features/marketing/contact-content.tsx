"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OpenAccessButton } from "@/features/access-request/open-access-button";
import { marketingGutter, marketingScreenSection } from "@/lib/constants";

import { Eyebrow } from "./eyebrow";

export function ContactContent() {
  return (
    <section
      id="contact"
      className={`${marketingGutter} ${marketingScreenSection}`}
    >
      <Eyebrow>Contact</Eyebrow>
      <h2 className="mt-3 max-w-[720px] font-heading text-[42px] tracking-[-0.04em]">
        Start a conversation with Atlas.
      </h2>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        For a confidential preview, use the access request. General inquiries
        can be left here once a support workflow is connected.
      </p>
      <form
        className="mt-10 max-w-md space-y-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" className="h-12 px-3.5" placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            className="h-12 px-3.5"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="h-12 px-5 font-bold" disabled>
            Send message
          </Button>
          <OpenAccessButton variant="outline" className="h-12 px-5 font-bold">
            Request access
          </OpenAccessButton>
        </div>
        <p className="text-sm text-muted-foreground">
          Message delivery is not connected yet. Request access for approved
          follow-up.
        </p>
      </form>
    </section>
  );
}
