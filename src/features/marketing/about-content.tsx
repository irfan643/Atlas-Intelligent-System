import { Eyebrow } from "./eyebrow";

export function AboutContent() {
  return (
    <section className="px-[clamp(22px,7vw,120px)] py-[84px]">
      <Eyebrow>About</Eyebrow>
      <h1 className="mt-3 max-w-[720px] font-heading text-[42px] tracking-[-0.04em]">
        Built for teams that need secure, intelligent learning systems.
      </h1>
      <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted-foreground">
        <p>
          Atlas Intelligent System brings together secure learning, intelligent
          tools, and organization-ready experiences for healthcare, education,
          and enterprise teams.
        </p>
        <p>
          Detailed demonstrations and project materials are available only
          through approved access. This page is a public overview while private
          workspaces stay behind invitation.
        </p>
      </div>
    </section>
  );
}
