"use client";

import { BookOpen, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CourseEnrollmentTab,
  type CourseStudentProgress,
} from "./course-enrollment-tab";
import { CourseLecturesTab } from "./course-lectures-tab";
import { CourseStatusToggle } from "./course-status-toggle";
import { EditCourseDialog } from "./edit-course-dialog";
import { doctorPageTitle } from "./form-ui";

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

export function CourseDashboard({
  course,
  students,
}: {
  course: CourseData;
  students: CourseStudentProgress[];
}) {
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

      <Tabs defaultValue="lectures" className="gap-5">
        <TabsList
          variant="default"
          className="h-10 w-full max-w-sm gap-1 rounded-md p-1 sm:w-fit"
        >
          <TabsTrigger
            value="lectures"
            className="gap-1.5 rounded-md px-4 py-2 text-sm"
          >
            <BookOpen className="size-3.5" />
            Lectures
          </TabsTrigger>
          <TabsTrigger
            value="enrollment"
            className="gap-1.5 rounded-md px-4 py-2 text-sm"
          >
            <Users className="size-3.5" />
            Enrollment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lectures" className="pt-1 outline-none">
          <CourseLecturesTab courseId={course.id} lectures={course.lectures} />
        </TabsContent>

        <TabsContent value="enrollment" className="pt-1 outline-none">
          <CourseEnrollmentTab courseId={course.id} students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
