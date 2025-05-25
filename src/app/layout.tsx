import "@carbon/styles/css/styles.css";
import "@/styles/global.scss";
import React from "react";
import { AppProviders } from "@/contexts/AppProviders";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <link rel="icon" href="/images/icon.png" />
      <title>Dashboard</title>
      <body>
        <AppProviders>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
