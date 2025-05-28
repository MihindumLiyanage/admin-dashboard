import React from "react";
import "@carbon/styles/css/styles.css";
import "@/styles/global.scss";
import { AppProviders } from "@/contexts/AppProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/images/icon.png" />
      <title>Dashboard</title>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
