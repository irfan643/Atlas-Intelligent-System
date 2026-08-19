import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OpenAccessButton } from "@/features/access-request/open-access-button";
import { SectionLink } from "@/features/marketing/section-link";
import { marketingGutter } from "@/lib/constants";

import { Eyebrow } from "./eyebrow";

export function Hero() {
  return (
    <section
      id="hero"
      className={`grid min-h-[calc(100dvh-4.5rem)] scroll-mt-[4.5rem] items-center gap-12 bg-linear-to-br from-white via-[#f7fbff] to-[#fbf9ff] py-[70px] max-[780px]:grid-cols-1 max-[780px]:py-12 min-[781px]:grid-cols-[1.05fr_0.95fr] ${marketingGutter}`}
    >
      <div>
        <Eyebrow>Intelligent technology for learning and organizations</Eyebrow>
        <h1 className="mt-4 mb-5.5 font-heading text-[clamp(48px,6vw,78px)] leading-[0.96] font-semibold tracking-[-0.06em]">
          Build smarter. Learn further.
        </h1>
        <p className="max-w-[610px] text-xl text-muted-foreground">
          Atlas brings together secure learning, intelligent tools, and
          organization-ready experiences for healthcare, education, and
          enterprise teams.
        </p>
        <div className="mt-7.5 flex flex-wrap gap-3">
          <OpenAccessButton className="h-12 rounded-xl px-5 text-base font-bold">
            Request access
          </OpenAccessButton>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-xl px-5 text-base font-bold"
          >
            <SectionLink href="/#solutions">Explore solutions</SectionLink>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Detailed demonstrations and project materials are available only
          through approved access.
        </p>
      </div>
      <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-linear-to-br from-[#0ba5d8] via-[#5144c9] to-[#ffc65d] shadow-[0_26px_70px_#3152792b]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,#ffeec4_0_6%,transparent_30%),radial-gradient(circle_at_34%_70%,#29d4c7_0_3%,transparent_22%)] opacity-90" />
        <div className="absolute inset-0 z-2 grid place-items-center">
          <OpenAccessButton
            aria-label="Play welcome video"
            className="animate-play-pulse size-[122px] rounded-full bg-white text-primary shadow-[0_14px_32px_#001c4b55] hover:bg-white"
          >
            <Play className="size-12 fill-current" />
          </OpenAccessButton>
        </div>
        <div className="absolute bottom-7 left-7 z-2 max-w-[270px] text-lg font-bold text-white">
          Play the Atlas welcome experience
        </div>
      </div>
    </section>
  );
}
