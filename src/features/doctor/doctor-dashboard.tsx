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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className={doctorPageTitle}>Welcome, {doctorName}</h1>
          <p className="text-sm text-muted-foreground">
            Your published and pending course overview.
          </p>
        </div>
        <CreateCourseDialog />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardDescription className="font-medium">Published</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {publishedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardDescription className="font-medium">
              Pending (draft)
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className={doctorSectionTitle}>Latest courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recently updated courses you own.
          </p>
        </div>

        {latestCourses.length === 0 ? (
          <Card size="sm" className="gap-0 rounded-lg py-0">
            <CardHeader className="gap-1 p-5">
              <CardTitle className="text-sm font-semibold">
                No courses yet
              </CardTitle>
              <CardDescription>
                Create your first course to see activity here. Stats stay at 0
                until then.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {latestCourses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="block h-full"
                >
                  <Card
                    size="sm"
                    className="h-full gap-0 rounded-lg py-0 transition-colors hover:bg-muted/40"
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-5">
                      <div className="min-w-0 space-y-0.5">
                        <CardTitle className="text-sm font-semibold">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {course.lectureCount} lecture
                          {course.lectureCount === 1 ? "" : "s"} ·{" "}
                          {course.enrollmentCount} enrolled
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          course.status === "PUBLISHED" ? "default" : "outline"
                        }
                        className="shrink-0 rounded-md"
                      >
                        {course.status === "PUBLISHED" ? "published" : "draft"}
                      </Badge>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
