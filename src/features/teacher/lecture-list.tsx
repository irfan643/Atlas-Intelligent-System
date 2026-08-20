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
import { Separator } from "@/components/ui/separator";

import { LectureForm } from "./lecture-form";
import { getYouTubeEmbedUrl } from "./youtube";

type LectureItem = {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  sourceType: "YOUTUBE" | "LINK";
  order: number;
  status: "DRAFT" | "PUBLISHED";
};

export function LectureList({
  courseId,
  lectures,
}: {
  courseId: string;
  lectures: LectureItem[];
}) {
  if (lectures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lectures</CardTitle>
          <CardDescription>
            No lectures yet. Add the first source below.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg tracking-tight">Lectures</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {lectures.length} lecture{lectures.length === 1 ? "" : "s"} in this
          course
        </p>
      </div>
      <div className="space-y-3">
        {lectures.map((lecture, index) => {
          const embedUrl = getYouTubeEmbedUrl(lecture.sourceUrl);

          return (
            <Card key={lecture.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Lecture {index + 1}
                    </p>
                    <CardTitle className="text-base">{lecture.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {lecture.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{lecture.status.toLowerCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <Link
                    href={lecture.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary break-all"
                  >
                    {lecture.sourceUrl}
                    <ExternalLink className="size-3.5 shrink-0" />
                  </Link>
                </div>

                {embedUrl ? (
                  <div className="overflow-hidden rounded-lg border bg-muted/30">
                    <iframe
                      title={lecture.title}
                      src={embedUrl}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                <Separator />

                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Edit lecture
                  </summary>
                  <div className="mt-3">
                    <LectureForm courseId={courseId} lecture={lecture} />
                  </div>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
