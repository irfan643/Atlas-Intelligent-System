import { marketingGutter } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Eyebrow } from "./eyebrow";

const workflow = [
  { label: "Curriculum and exam pathway", live: true },
  { label: "Graduate textbook chapters", live: true },
  { label: "Rapid-review book and study guide", live: false },
  { label: "Question bank and Mnemonic Studio", live: false },
  { label: "LMS, audio, video, and picture book", live: false },
];

export function ProductionSection() {
  return (
    <section
      id="production"
      className={`scroll-mt-24 bg-[#f5f8ff] py-[84px] ${marketingGutter}`}
    >
      <Eyebrow>Production Center</Eyebrow>
      <h2 className="mt-3 max-w-[720px] font-heading text-[42px] tracking-[-0.04em]">
        One approved source. Every learning product connected.
      </h2>
      <div className="mt-8.5 grid gap-6 min-[781px]:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border bg-white p-7">
          {workflow.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3.5 py-3.5 font-bold",
                index < workflow.length - 1 && "border-b",
              )}
            >
              <span
                className={cn(
                  "size-3.5 shrink-0 rounded-full bg-[#d8e1ec]",
                  item.live && "bg-[#13b886] shadow-[0_0_0_6px_#13b88622]",
                )}
              />
              {item.label}
            </div>
          ))}
        </div>
        <aside className="rounded-[22px] bg-linear-to-br from-navy to-[#1e4f7a] p-[30px] text-white">
          <Eyebrow className="text-[#c7dcff]">Build activity</Eyebrow>
          <h3 className="mt-3 mb-3 font-heading text-[28px]">
            Atlas is organizing your production system.
          </h3>
          <div
            className="my-5 size-12 animate-spin rounded-full border-[5px] border-white/25 border-t-white"
            aria-label="Build activity indicator"
          />
          <p className="text-[#d7e7f7]">
            Every title moves through writing, clinical review, learning design,
            quality checks, and release approval.
          </p>
        </aside>
      </div>
    </section>
  );
}
