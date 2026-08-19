import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { marketingGutter, marketingScreenSection } from "@/lib/constants";

import { Eyebrow } from "./eyebrow";

const solutions = [
  {
    title: "Learning systems",
    description:
      "Interactive education, visual memory tools, practice experiences, and progress tracking.",
  },
  {
    title: "Organization tools",
    description:
      "Private workspaces, role-based access, collaboration, and secure project workflows.",
  },
  {
    title: "Custom intelligence",
    description:
      "Approved AI assistants and workflows designed around each organization’s needs.",
  },
];

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      className={`${marketingGutter} ${marketingScreenSection}`}
    >
      <Eyebrow>Solutions</Eyebrow>
      <h2 className="mt-3 max-w-[720px] font-heading text-[42px] tracking-[-0.04em]">
        One intelligent front door. Purpose-built experiences inside.
      </h2>
      <div className="mt-8.5 grid gap-4.5 min-[781px]:grid-cols-3">
        {solutions.map((solution) => (
          <Card key={solution.title} className="rounded-[18px] py-7">
            <CardHeader>
              <CardTitle className="text-[21px] font-bold">
                {solution.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{solution.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
