import { compare, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import type { LoginInput, PublicUser, RegisterInput } from "./schema";

const SALT_ROUNDS = 12;

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: "TEACHER";
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function registerUser(
  input: RegisterInput,
): Promise<PublicUser> {
  const passwordHash = await hash(input.password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password: passwordHash,
        role: "TEACHER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return toPublicUser(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AuthError("An account with this email already exists.", 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new AuthError("Invalid email or password.", 401);
  }

  const passwordMatches = await compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AuthError("Invalid email or password.", 401);
  }

  return toPublicUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
