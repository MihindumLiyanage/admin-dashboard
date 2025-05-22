"use client";

import React from "react";
import { Header } from "./header/Header";
import { Sidebar } from "./sidebar/Sidebar";
import styles from "./Layout.module.scss";
import { useSidebar } from "../contexts/SidebarContext";

export const Layout = ({ children }: { children: React.ReactNode }) => {
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
};
