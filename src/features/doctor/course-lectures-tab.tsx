import Link from "next/link";
import { ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CreateLectureDialog } from "./create-lecture-dialog";
import { EditLectureDialog } from "./edit-lecture-dialog";
import { getYouTubeEmbedUrl } from "./youtube";

type LectureItem = {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  order: number;
  status: "DRAFT" | "PUBLISHED";
};

export function CourseLecturesTab({
  courseId,
  lectures,
}: {
  courseId: string;
  lectures: LectureItem[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Lectures</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sources you added for this course.
          </p>
        </div>
        <CreateLectureDialog courseId={courseId} />
      </div>

      {lectures.length === 0 ? (
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
          {lectures.map((lecture, index) => {
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
                    className="inline-flex items-center gap-1.5 text-sm font-medium break-all text-primary"
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
  );
}
