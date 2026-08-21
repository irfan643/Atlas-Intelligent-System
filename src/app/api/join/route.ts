import { NextResponse } from "next/server";

import {
  JoinError,
  acceptJoinInvite,
  getJoinInvite,
  joinAcceptSchema,
} from "@/features/join/service";

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    const invite = await getJoinInvite(token);
    return NextResponse.json({ invite });
  } catch (error) {
    if (error instanceof JoinError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[join/get]", error);
    return NextResponse.json(
      { error: "Unable to validate invite." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = joinAcceptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const result = await acceptJoinInvite(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof JoinError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[join/post]", error);
    return NextResponse.json(
      { error: "Unable to join the course right now." },
      { status: 500 },
    );
  }
}
