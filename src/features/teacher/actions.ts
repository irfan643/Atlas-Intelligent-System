"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireTeacherSession } from "@/lib/session";

import {
  courseDescriptionSchema,
  lectureSchema,
  type CourseDescriptionInput,
  type LectureInput,
} from "./schema";
import { inferSourceType } from "./youtube";

export async function listTeacherCourses() {
  const session = await requireTeacherSession();

  return prisma.course.findMany({
    where: { teacherId: session.id },
    orderBy: { title: "asc" },
    include: {
      _count: { select: { lectures: true } },
    },
  });
}

export async function getTeacherCourse(courseId: string) {
  const session = await requireTeacherSession();

  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId: session.id },
    include: {
      lectures: { orderBy: { order: "asc" } },
      _count: { select: { lectures: true } },
    },
  });

  if (!course) {
    return null;
  }

  return course;
}

export async function updateCourseDescription(
  courseId: string,
  input: CourseDescriptionInput,
) {
  const session = await requireTeacherSession();
  const parsed = courseDescriptionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid description.",
    };
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId: session.id },
    select: { id: true },
  });

  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { description: parsed.data.description },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${courseId}`);

  return { ok: true as const };
}

export async function createLecture(courseId: string, input: LectureInput) {
  const session = await requireTeacherSession();
  const parsed = lectureSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid lecture.",
    };
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId: session.id },
    select: { id: true },
  });

  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  const last = await prisma.lecture.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.lecture.create({
    data: {
      courseId,
      title: parsed.data.title,
      description: parsed.data.description,
      sourceUrl: parsed.data.sourceUrl,
      sourceType: inferSourceType(parsed.data.sourceUrl),
      order: (last?.order ?? 0) + 1,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${courseId}`);

  return { ok: true as const };
}

export async function updateLecture(
  courseId: string,
  lectureId: string,
  input: LectureInput,
) {
  const session = await requireTeacherSession();
  const parsed = lectureSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid lecture.",
    };
  }

  const lecture = await prisma.lecture.findFirst({
    where: {
      id: lectureId,
      courseId,
      course: { teacherId: session.id },
    },
    select: { id: true },
  });

  if (!lecture) {
    return { ok: false as const, error: "Lecture not found." };
  }

  await prisma.lecture.update({
    where: { id: lectureId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      sourceUrl: parsed.data.sourceUrl,
      sourceType: inferSourceType(parsed.data.sourceUrl),
    },
  });

  revalidatePath(`/dashboard/courses/${courseId}`);

  return { ok: true as const };
}

export async function getTeacherDashboardStats() {
  const session = await requireTeacherSession();

  const courses = await prisma.course.findMany({
    where: { teacherId: session.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { lectures: true } },
    },
  });

  const lectureCount = courses.reduce(
    (sum, course) => sum + course._count.lectures,
    0,
  );
  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;

  return {
    session,
    courses,
    courseCount: courses.length,
    lectureCount,
    publishedCount,
  };
}
