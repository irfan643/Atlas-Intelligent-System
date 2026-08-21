import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseStatusToggle } from "./course-status-toggle";
import { CreateCourseDialog } from "./create-course-dialog";
import { EditCourseDialog } from "./edit-course-dialog";
import { doctorActionButton, doctorPageTitle } from "./form-ui";

type CourseItem = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  enrollmentCount: number;
  _count: { lectures: number };
};

export function DoctorCoursesPage({ courses }: { courses: CourseItem[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className={doctorPageTitle}>My Courses</h1>
          <p className="text-sm text-muted-foreground">
            Only courses you created. Open one for its course dashboard.
          </p>
        </div>
        <CreateCourseDialog />
      </div>

      {courses.length === 0 ? (
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardTitle className="text-sm font-semibold">
              No courses yet
            </CardTitle>
            <CardDescription>
              Click Add course to open the form and create your first course.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              size="sm"
              className="flex flex-col gap-0 rounded-lg py-0"
            >
              <CardHeader className="space-y-1.5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base leading-snug font-semibold">
                    {course.title}
                  </CardTitle>
                  <Badge
                    variant={
                      course.status === "PUBLISHED" ? "default" : "outline"
                    }
                    className="rounded-md"
                  >
                    {course.status === "PUBLISHED" ? "published" : "draft"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-sm leading-5">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-2.5 px-5 pb-5">
                <p className="text-xs text-muted-foreground">
                  {course._count.lectures} lecture
                  {course._count.lectures === 1 ? "" : "s"} ·{" "}
                  {course.enrollmentCount} enrolled
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className={doctorActionButton}>
                    <Link href={`/dashboard/courses/${course.id}`}>
                      Open dashboard
                    </Link>
                  </Button>
                  <EditCourseDialog course={course} />
                  <CourseStatusToggle
                    courseId={course.id}
                    status={course.status}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
