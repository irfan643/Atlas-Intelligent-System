import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CourseDashboard } from "@/features/doctor/course-dashboard";
import {
  DoctorError,
  getDoctorCourse,
  listCourseStudents,
} from "@/features/doctor/service";
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

  if (!session || session.role !== "DOCTOR") {
    redirect("/login");
  }

  const { id } = await params;

  try {
    const [course, students] = await Promise.all([
      getDoctorCourse(session.id, id),
      listCourseStudents(session.id, id),
    ]);
    return <CourseDashboard course={course} students={students} />;
  } catch (error) {
    if (error instanceof DoctorError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
