import { NextResponse } from "next/server";

import { AuthError, registerUser } from "@/features/auth/service";
import { registerSchema } from "@/features/auth/schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const user = await registerUser(parsed.data);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unable to create the account right now." },
      { status: 500 },
    );
  }
}
