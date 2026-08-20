import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CourseWorkspace } from "@/features/teacher/course-workspace";
import { getTeacherCourse } from "@/features/teacher/actions";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Course",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const course = await getTeacherCourse(id);

  if (!course) {
    notFound();
  }

  return <CourseWorkspace course={course} />;
}
