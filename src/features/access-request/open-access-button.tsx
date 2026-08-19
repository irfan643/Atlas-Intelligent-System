"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAccessRequest } from "./access-request-provider";

type OpenAccessButtonProps = React.ComponentProps<typeof Button>;

export function OpenAccessButton({
  className,
  children = "Request access",
  ...props
}: OpenAccessButtonProps) {
  const { openAccess } = useAccessRequest();

  return (
    <Button
      type="button"
      className={cn(className)}
      {...props}
      onClick={openAccess}
    >
      {children}
    </Button>
  );
}
