"use client";

import React from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Header } from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import styles from "@/styles/layouts/layout.module.scss";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div
        className={`${styles.mainContent} ${!isOpen ? styles.collapsed : ""}`}
      >
        <Header />
        <div className={styles.contentArea}>{children}</div>
      </div>
    </div>
  );
}
