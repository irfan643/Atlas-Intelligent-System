import { NextResponse } from "next/server";

import { DoctorError } from "@/features/doctor/service";
import { getSession } from "@/lib/session";

export async function requireApiDoctor() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  return { session, error: null };
}

export function doctorErrorResponse(error: unknown) {
  if (error instanceof DoctorError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong." },
    { status: 500 },
  );
}
