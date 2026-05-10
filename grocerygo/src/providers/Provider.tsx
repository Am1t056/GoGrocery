"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const SP = SessionProvider as React.ComponentType<{ children: React.ReactNode }>;
  return (
    <SP>
      {children}
    </SP>
  );
};

export default Provider;