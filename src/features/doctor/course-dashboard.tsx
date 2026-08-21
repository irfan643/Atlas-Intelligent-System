import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseStatusToggle } from "./course-status-toggle";
import { CreateLectureDialog } from "./create-lecture-dialog";
import { EditCourseDialog } from "./edit-course-dialog";
import { EditLectureDialog } from "./edit-lecture-dialog";
import {
  doctorPageTitle,
  doctorSectionTitle,
} from "./form-ui";
import { getYouTubeEmbedUrl } from "./youtube";

type LectureItem = {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  order: number;
  status: "DRAFT" | "PUBLISHED";
};

type CourseData = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  enrollmentCount: number;
  _count: { lectures: number };
  lectures: LectureItem[];
};

export function CourseDashboard({ course }: { course: CourseData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={doctorPageTitle}>{course.title}</h1>
            <Badge
              variant={course.status === "PUBLISHED" ? "default" : "outline"}
              className="rounded-md"
            >
              {course.status === "PUBLISHED" ? "published" : "draft"}
            </Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {course.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <EditCourseDialog course={course} />
          <CourseStatusToggle courseId={course.id} status={course.status} />
          <CreateLectureDialog courseId={course.id} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardDescription className="font-medium">Lectures</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {course._count.lectures}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardDescription className="font-medium">Enrollments</CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {course.enrollmentCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardDescription className="font-medium">Status</CardDescription>
            <CardTitle className="text-base font-semibold capitalize">
              {course.status === "PUBLISHED" ? "Published" : "Draft"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className={doctorSectionTitle}>Lectures</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sources you added for this course.
          </p>
        </div>

        {course.lectures.length === 0 ? (
          <Card size="sm" className="gap-0 rounded-lg py-0">
            <CardHeader className="gap-1 p-5">
              <CardTitle className="text-sm font-semibold">
                No lectures yet
              </CardTitle>
              <CardDescription>
                Use Add lecture to open the form and attach a source URL.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {course.lectures.map((lecture, index) => {
              const embedUrl = getYouTubeEmbedUrl(lecture.sourceUrl);

              return (
                <Card
                  key={lecture.id}
                  size="sm"
                  className="flex h-full flex-col gap-0 rounded-lg py-0"
                >
                  <CardHeader className="space-y-1.5 p-5 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Lecture {index + 1}
                      </p>
                      <EditLectureDialog lecture={lecture} />
                    </div>
                    <CardTitle className="line-clamp-2 text-sm font-semibold">
                      {lecture.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm leading-5">
                      {lecture.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-2.5 px-5 pb-5">
                    <Link
                      href={lecture.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary break-all"
                    >
                      <span className="line-clamp-1">{lecture.sourceUrl}</span>
                      <ExternalLink className="size-3.5 shrink-0" />
                    </Link>
                    {embedUrl ? (
                      <div className="overflow-hidden rounded-md border">
                        <iframe
                          title={lecture.title}
                          src={embedUrl}
                          className="aspect-video max-h-40 w-full"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
