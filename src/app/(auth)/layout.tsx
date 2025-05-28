import React from "react";
import styles from "@/styles/pages/auth.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.authContainer}>{children}</div>;
}
