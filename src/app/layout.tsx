"use client";

import React from "react";
import { usePathname } from "next/navigation";

import "@/styles/global.scss";
import { AppProviders } from "@/contexts/AppProviders";
import { sidebarItems } from "@/data/sidebarItems";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const authPageTitles: Record<string, string> = {
    "/login": "Login",
    "/forgot-password": "Forgot Password",
  };

  const activeItem = sidebarItems.find((item) => item.href === pathname);

  const pageTitle = activeItem?.label || authPageTitles[pathname];

  return (
    <html lang="en">
      <link rel="icon" href="/images/icon.png" />
      <title>{` Dashboard | ${pageTitle}`}</title>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
