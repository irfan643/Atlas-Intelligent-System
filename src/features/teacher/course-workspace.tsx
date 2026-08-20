import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseDescriptionForm } from "./course-description-form";
import { LectureForm } from "./lecture-form";
import { LectureList } from "./lecture-list";

type CourseWorkspaceData = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  _count: { lectures: number };
  lectures: Array<{
    id: string;
    title: string;
    description: string;
    sourceUrl: string;
    sourceType: "YOUTUBE" | "LINK";
    order: number;
    status: "DRAFT" | "PUBLISHED";
  }>;
};

export function CourseWorkspace({ course }: { course: CourseWorkspaceData }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl tracking-tight">{course.title}</h1>
          <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
            {course.status.toLowerCase()}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {course._count.lectures} lecture
          {course._count.lectures === 1 ? "" : "s"} in this course
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <LectureList courseId={course.id} lectures={course.lectures} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course description</CardTitle>
              <CardDescription>
                Update how this course is described for your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseDescriptionForm
                courseId={course.id}
                description={course.description}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add lecture</CardTitle>
              <CardDescription>
                Add a title, description, and YouTube or source URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LectureForm courseId={course.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
