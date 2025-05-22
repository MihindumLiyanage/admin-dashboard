"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { SidebarProvider } from "./SidebarContext";
import { AuthProvider } from "./AuthContext";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <ThemeProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  </AuthProvider>
);
