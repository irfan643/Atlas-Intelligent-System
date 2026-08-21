import { NextResponse } from "next/server";

import { AuthError, registerUser } from "@/features/auth/service";
import { registerSchema } from "@/features/auth/schema";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import { encodeSession } from "@/lib/session-token";

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
    const response = NextResponse.json({ user }, { status: 201 });

    if (user.role === "DOCTOR") {
      response.cookies.set(
        SESSION_COOKIE,
        await encodeSession({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 14,
        },
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[auth/register]", error);

    return NextResponse.json(
      { error: "Unable to create the account right now." },
      { status: 500 },
    );
  }
}
