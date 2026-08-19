import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const learningAreas = [
  {
    title: "Interactive education",
    description:
      "Courses and visual memory tools designed for healthcare, education, and enterprise teams.",
  },
  {
    title: "Practice experiences",
    description:
      "Question banks, rapid review, and study guides connected to a single approved source.",
  },
  {
    title: "Progress tracking",
    description:
      "See how learners move through pathways once accounts and roles are connected.",
  },
];

export function LearningContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Learning</h1>
        <p className="mt-1 text-muted-foreground">
          Interactive education, visual memory tools, practice experiences, and
          progress tracking.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {learningAreas.map((area) => (
          <Card key={area.title}>
            <CardHeader>
              <CardTitle>{area.title}</CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Content for this module will appear here after approved access is
              connected to a signed-in account.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
