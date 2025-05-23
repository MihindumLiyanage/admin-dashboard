"use client";

import React from "react";
import Head from "next/head";
import { Header } from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import styles from "@/styles/layouts/layout.module.scss";
import { useSidebar } from "@/contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Layout = ({ children, title, description }: LayoutProps) => {
  const { isOpen } = useSidebar();

  return (
    <>
      <Head>
        <title>{title ? `Dashboard | ${title}` : "Dashboard"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className={styles.layout}>
        <Sidebar />
        <div
          className={`${styles.mainContent} ${!isOpen ? styles.collapsed : ""}`}
        >
          <Header />
          <div className={styles.contentArea}>{children}</div>
        </div>
      </div>
    </>
  );
};
