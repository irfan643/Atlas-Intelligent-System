import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CreateCourseDialog } from "./create-course-dialog";
import { doctorPageTitle, doctorSectionTitle } from "./form-ui";

type LatestCourse = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  lectureCount: number;
  enrollmentCount: number;
};

export function DoctorDashboardOverview({
  doctorName,
  publishedCount,
  pendingCount,
  latestCourses,
}: {
  doctorName: string;
  publishedCount: number;
  pendingCount: number;
  latestCourses: LatestCourse[];
}) {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <h1 className={doctorPageTitle}>Welcome, {doctorName}</h1>
          <p className="text-base text-muted-foreground">
            Your published and pending course overview.
          </p>
        </div>
        <CreateCourseDialog />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader className="gap-2 p-6 pb-5">
            <CardDescription className="font-medium">Published</CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {publishedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="gap-2 p-6 pb-5">
            <CardDescription className="font-medium">
              Pending (draft)
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-5">
        <div>
          <h2 className={doctorSectionTitle}>Latest courses</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Recently updated courses you own.
          </p>
        </div>

        {latestCourses.length === 0 ? (
          <Card className="rounded-lg">
            <CardHeader className="gap-2 p-6">
              <CardTitle className="text-base font-semibold">
                No courses yet
              </CardTitle>
              <CardDescription>
                Create your first course to see activity here. Stats stay at 0
                until then.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <ul className="divide-y rounded-lg border">
            {latestCourses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-muted/40"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.lectureCount} lecture
                      {course.lectureCount === 1 ? "" : "s"} ·{" "}
                      {course.enrollmentCount} enrolled
                    </p>
                  </div>
                  <Badge
                    variant={
                      course.status === "PUBLISHED" ? "default" : "outline"
                    }
                    className="rounded-md"
                  >
                    {course.status === "PUBLISHED" ? "published" : "draft"}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
