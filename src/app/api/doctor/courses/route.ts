import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { courseCreateSchema } from "@/features/doctor/schema";
import {
  createDoctorCourse,
  listDoctorCourses,
} from "@/features/doctor/service";

export async function GET() {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const courses = await listDoctorCourses(session.id);
    return NextResponse.json({ courses });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const body: unknown = await request.json();
    const parsed = courseCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const course = await createDoctorCourse(session.id, parsed.data);
    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
