import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { decodeInviteToken } from "@/lib/invite-token";

export class JoinError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "JoinError";
  }
}

export const joinAcceptSchema = z.object({
  token: z.string().min(1, "Invite token is required."),
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type JoinAcceptInput = z.infer<typeof joinAcceptSchema>;

export async function getJoinInvite(token: string) {
  const payload = await decodeInviteToken(token);

  if (!payload) {
    throw new JoinError("This invite link is invalid or has expired.", 400);
  }

  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
    select: { id: true, title: true, status: true },
  });

  if (!course) {
    throw new JoinError("This course is no longer available.", 404);
  }

  return {
    courseId: course.id,
    courseTitle: course.title,
    email: payload.email,
  };
}

export async function acceptJoinInvite(input: JoinAcceptInput) {
  const invite = await getJoinInvite(input.token);
  const email = invite.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, password: true },
  });

  if (existing?.role === "DOCTOR") {
    throw new JoinError(
      "This email belongs to a doctor account. Use a different invite email.",
      409,
    );
  }

  let userId = existing?.id;
  let createdAccount = false;

  if (existing) {
    const passwordMatches = await compare(input.password, existing.password);
    if (!passwordMatches) {
      throw new JoinError(
        "An account with this email already exists. Enter the correct password to enroll.",
        401,
      );
    }
  } else {
    const passwordHash = await hash(input.password, 12);
    try {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email,
          password: passwordHash,
          role: "STUDENT",
        },
        select: { id: true },
      });
      userId = user.id;
      createdAccount = true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new JoinError("An account with this email already exists.", 409);
      }
      throw error;
    }
  }

  if (!userId) {
    throw new JoinError("Unable to create student account.", 500);
  }

  const alreadyEnrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: invite.courseId,
      },
    },
  });

  if (!alreadyEnrolled) {
    await prisma.enrollment.create({
      data: {
        userId,
        courseId: invite.courseId,
      },
    });
    await prisma.course.update({
      where: { id: invite.courseId },
      data: { enrollmentCount: { increment: 1 } },
    });
  }

  return {
    courseId: invite.courseId,
    courseTitle: invite.courseTitle,
    email,
    createdAccount,
  };
}
