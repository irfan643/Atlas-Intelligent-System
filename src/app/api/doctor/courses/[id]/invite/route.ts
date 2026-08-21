import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { courseInviteSchema } from "@/features/doctor/schema";
import { inviteStudentToCourse } from "@/features/doctor/service";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = courseInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;
    const result = await inviteStudentToCourse(
      session.id,
      id,
      parsed.data,
      process.env.NEXT_PUBLIC_APP_URL ?? origin,
    );

    return NextResponse.json(result);
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
