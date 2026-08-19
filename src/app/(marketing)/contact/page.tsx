import type { Metadata } from "next";

import { ContactContent } from "@/features/marketing/contact-content";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return <ContactContent />;
}
