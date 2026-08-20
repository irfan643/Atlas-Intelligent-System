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

type CourseCardData = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  _count: { lectures: number };
};

export function CourseCards({ courses }: { courses: CourseCardData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
              <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                {course.status.toLowerCase()}
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 text-sm leading-6">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex items-center justify-between gap-3 pt-0">
            <p className="text-sm text-muted-foreground">
              {course._count.lectures} lecture
              {course._count.lectures === 1 ? "" : "s"}
            </p>
            <Button asChild size="sm">
              <Link href={`/dashboard/courses/${course.id}`}>Open course</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
