import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { listCourseStudents } from "@/features/doctor/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const { id } = await context.params;
    const students = await listCourseStudents(session.id, id);
    return NextResponse.json({ students });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
