import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DoctorCoursesPage } from "@/features/doctor/doctor-courses-page";
import { listDoctorCourses } from "@/features/doctor/service";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Courses",
};

export default async function CoursesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const courses = await listDoctorCourses(session.id);

  return <DoctorCoursesPage courses={courses} />;
}
