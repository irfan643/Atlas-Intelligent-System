import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import type {
  CourseCreateInput,
  CourseStatusInput,
  CourseUpdateInput,
  LectureCreateInput,
  LectureUpdateInput,
  ProfileUpdateInput,
} from "./schema";
import { inferSourceType } from "./youtube";

export class DoctorError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "DoctorError";
  }
}

export async function getDoctorDashboard(doctorId: string) {
  const courses = await prisma.course.findMany({
    where: { doctorId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { lectures: true } },
    },
  });

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;
  const pendingCount = courses.filter((c) => c.status === "DRAFT").length;

  return {
    publishedCount,
    pendingCount,
    latestCourses: courses.slice(0, 5).map((course) => ({
      id: course.id,
      title: course.title,
      status: course.status,
      enrollmentCount: course.enrollmentCount,
      lectureCount: course._count.lectures,
      updatedAt: course.updatedAt,
    })),
  };
}

export async function listDoctorCourses(doctorId: string) {
  return prisma.course.findMany({
    where: { doctorId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { lectures: true } },
    },
  });
}

export async function getDoctorCourse(doctorId: string, courseId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, doctorId },
    include: {
      lectures: { orderBy: { order: "asc" } },
      _count: { select: { lectures: true } },
    },
  });

  if (!course) {
    throw new DoctorError("Course not found.", 404);
  }

  return course;
}

export async function createDoctorCourse(
  doctorId: string,
  input: CourseCreateInput,
) {
  return prisma.course.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      doctorId,
      enrollmentCount: 0,
    },
    include: {
      _count: { select: { lectures: true } },
    },
  });
}

export async function updateDoctorCourse(
  doctorId: string,
  courseId: string,
  input: CourseUpdateInput,
) {
  await getDoctorCourse(doctorId, courseId);

  return prisma.course.update({
    where: { id: courseId },
    data: {
      title: input.title,
      description: input.description,
    },
    include: {
      _count: { select: { lectures: true } },
    },
  });
}

export async function updateDoctorCourseStatus(
  doctorId: string,
  courseId: string,
  input: CourseStatusInput,
) {
  await getDoctorCourse(doctorId, courseId);

  return prisma.course.update({
    where: { id: courseId },
    data: { status: input.status },
    include: {
      _count: { select: { lectures: true } },
    },
  });
}

export async function createDoctorLecture(
  doctorId: string,
  courseId: string,
  input: LectureCreateInput,
) {
  await getDoctorCourse(doctorId, courseId);

  const last = await prisma.lecture.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return prisma.lecture.create({
    data: {
      courseId,
      title: input.title,
      description: input.description,
      sourceUrl: input.sourceUrl,
      sourceType: inferSourceType(input.sourceUrl),
      order: (last?.order ?? 0) + 1,
      status: "DRAFT",
    },
  });
}

export async function updateDoctorLecture(
  doctorId: string,
  lectureId: string,
  input: LectureUpdateInput,
) {
  const lecture = await prisma.lecture.findFirst({
    where: {
      id: lectureId,
      course: { doctorId },
    },
    select: { id: true, courseId: true },
  });

  if (!lecture) {
    throw new DoctorError("Lecture not found.", 404);
  }

  return prisma.lecture.update({
    where: { id: lectureId },
    data: {
      title: input.title,
      description: input.description,
      sourceUrl: input.sourceUrl,
      sourceType: inferSourceType(input.sourceUrl),
    },
  });
}

export async function getDoctorProfile(doctorId: string) {
  const user = await prisma.user.findUnique({
    where: { id: doctorId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new DoctorError("Profile not found.", 404);
  }

  return user;
}

export async function updateDoctorProfile(
  doctorId: string,
  input: ProfileUpdateInput,
) {
  const data: Prisma.UserUpdateInput = {
    name: input.name,
    email: input.email.toLowerCase(),
  };

  if (input.password && input.password.length >= 8) {
    data.password = await hash(input.password, 12);
  }

  try {
    return await prisma.user.update({
      where: { id: doctorId },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DoctorError("An account with this email already exists.", 409);
    }

    throw error;
  }
}
