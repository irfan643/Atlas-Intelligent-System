import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { lectureCreateSchema } from "@/features/doctor/schema";
import { createDoctorLecture } from "@/features/doctor/service";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = lectureCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const lecture = await createDoctorLecture(session.id, id, parsed.data);
    return NextResponse.json({ lecture }, { status: 201 });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
