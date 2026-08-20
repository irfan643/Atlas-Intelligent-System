import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseCards } from "./course-cards";

type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  _count: { lectures: number };
};

export function TeacherDashboardOverview({
  teacherName,
  courseCount,
  lectureCount,
  publishedCount,
  courses,
}: {
  teacherName: string;
  courseCount: number;
  lectureCount: number;
  publishedCount: number;
  courses: DashboardCourse[];
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl tracking-tight">
            Welcome, {teacherName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your assigned courses and lecture sources in one workspace.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/courses">View all courses</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Courses</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{courseCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lectures</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{lectureCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{publishedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg tracking-tight">Your courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each course is separate. Lecture counts update as you add sources.
          </p>
        </div>
        <CourseCards courses={courses} />
      </div>
    </div>
  );
}
