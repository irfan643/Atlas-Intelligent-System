import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const workflow = [
  { label: "Curriculum and exam pathway", live: true },
  { label: "Graduate textbook chapters", live: true },
  { label: "Rapid-review book and study guide", live: false },
  { label: "Question bank and Mnemonic Studio", live: false },
  { label: "LMS, audio, video, and picture book", live: false },
];

export function ProductionContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Production</h1>
        <p className="mt-1 text-muted-foreground">
          One approved source. Every learning product connected.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Build activity</CardTitle>
        </CardHeader>
        <CardContent>
          {workflow.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 py-3.5 font-semibold",
                index < workflow.length - 1 && "border-b",
              )}
            >
              <span
                className={cn(
                  "size-3.5 shrink-0 rounded-full bg-[#d8e1ec]",
                  item.live && "bg-[#13b886] shadow-[0_0_0_6px_#13b88622]",
                )}
              />
              <span>{item.label}</span>
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {item.live ? "Live" : "Queued"}
              </span>
            </div>
          ))}
          <p className="mt-4 text-sm text-muted-foreground">
            Every title moves through writing, clinical review, learning design,
            quality checks, and release approval.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
