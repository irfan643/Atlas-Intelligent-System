import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CourseCards } from "@/features/teacher/course-cards";
import { listTeacherCourses } from "@/features/teacher/actions";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Courses",
};

export default async function CoursesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const courses = await listTeacherCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">My Courses</h1>
        <p className="mt-1 text-muted-foreground">
          {courses.length} assigned course{courses.length === 1 ? "" : "s"}. Open
          one to manage lectures and sources.
        </p>
      </div>
      <CourseCards courses={courses} />
    </div>
  );
}
