"use server";

import { requestAccessSchema } from "./schema";

export type RequestAccessResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function requestAccessAction(
  input: unknown,
): Promise<RequestAccessResult> {
  const parsed = requestAccessSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    };
  }

  return {
    ok: true,
    message:
      "Preview request recorded in this prototype. Connect this step to your secure form, CRM, NDA, and invitation workflow before publishing.",
  };
}
