import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { profileUpdateSchema } from "@/features/doctor/schema";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "@/features/doctor/service";
import { createSession } from "@/lib/session";

export async function GET() {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const profile = await getDoctorProfile(session.id);
    return NextResponse.json({ profile });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}

export async function PATCH(request: Request) {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const body: unknown = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const profile = await updateDoctorProfile(session.id, parsed.data);

    await createSession({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: "DOCTOR",
    });

    return NextResponse.json({ profile });
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
