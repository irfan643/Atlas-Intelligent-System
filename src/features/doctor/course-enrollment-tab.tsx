"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InviteStudentDialog } from "./invite-student-dialog";

export type CourseStudentProgress = {
  id: string;
  name: string;
  email: string;
  completedCount: number;
  lectureTotal: number;
  percent: number;
  enrolledAt: string | Date;
};

function formatEnrolledAt(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CourseEnrollmentTab({
  courseId,
  students,
}: {
  courseId: string;
  students: CourseStudentProgress[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Enrollment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Students enrolled in this course and their lecture progress.
          </p>
        </div>
        <InviteStudentDialog courseId={courseId} />
      </div>

      {students.length === 0 ? (
        <Card size="sm" className="gap-0 rounded-lg py-0">
          <CardHeader className="gap-1 p-5">
            <CardTitle className="text-sm font-semibold">
              No students yet
            </CardTitle>
            <CardDescription>
              Invite a student to this course to track enrollment and progress.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Enrolled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.email}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {student.completedCount}/{student.lectureTotal} ·{" "}
                    {student.percent}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatEnrolledAt(student.enrolledAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
