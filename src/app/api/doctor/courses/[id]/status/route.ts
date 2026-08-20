import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { courseStatusSchema } from "@/features/doctor/schema";
import { updateDoctorCourseStatus } from "@/features/doctor/service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = courseStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const course = await updateDoctorCourseStatus(session.id, id, parsed.data);
    return NextResponse.json({ course });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
