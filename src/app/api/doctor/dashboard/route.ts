import { NextResponse } from "next/server";

import { doctorErrorResponse, requireApiDoctor } from "@/features/doctor/api";
import { getDoctorDashboard } from "@/features/doctor/service";

export async function GET() {
  const { session, error } = await requireApiDoctor();
  if (error || !session) return error!;

  try {
    const data = await getDoctorDashboard(session.id);
    return NextResponse.json(data);
  } catch (err) {
    return doctorErrorResponse(err);
  }
}
