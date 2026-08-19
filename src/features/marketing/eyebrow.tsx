import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[13px] font-extrabold uppercase tracking-[0.12em] text-violet",
        className,
      )}
    >
      {children}
    </p>
  );
}
