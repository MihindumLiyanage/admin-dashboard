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

  const pageTitles: Record<string, string> = {
    "/login": "Login",
    "/forgot-password": "Forgot Password",
    "/settings": "Settings",
  };

  const activeItem = sidebarItems.find((item) => item.href === pathname);
  const pageTitle = activeItem?.label || pageTitles[pathname];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icon.png" />
        <title>{`Dashboard | ${pageTitle}`}</title>
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
