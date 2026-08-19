"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { AccessDialog } from "./access-dialog";

type AccessRequestContextValue = {
  openAccess: () => void;
};

const AccessRequestContext = createContext<AccessRequestContextValue | null>(
  null,
);

export function AccessRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      openAccess: () => setOpen(true),
    }),
    [],
  );

  return (
    <AccessRequestContext.Provider value={value}>
      {children}
      <AccessDialog open={open} onOpenChange={setOpen} />
    </AccessRequestContext.Provider>
  );
}

export function useAccessRequest() {
  const context = useContext(AccessRequestContext);

  if (!context) {
    throw new Error(
      "useAccessRequest must be used within AccessRequestProvider.",
    );
  }

  return context;
}
