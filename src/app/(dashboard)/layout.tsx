"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "@/styles/layouts/layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

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
