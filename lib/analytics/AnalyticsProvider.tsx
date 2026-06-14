"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "./track";

interface Props {
  app: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ app, children }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    trackPageView(app, { path: (pathname || "/") + search });
  }, [app, pathname]);

  return <>{children}</>;
}

export default AnalyticsProvider;
