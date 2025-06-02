"use client";

import React from "react";
import {
  Header as CarbonHeader,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Moon, Sun } from "@carbon/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/layouts/header.module.scss";

export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <CarbonHeader aria-label="Admin Dashboard Header" className={styles.header}>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Change Theme"
          onClick={toggleTheme}
          tooltipAlignment="end"
        >
          {theme === "g100" ? <Sun size={20} /> : <Moon size={20} />}
        </HeaderGlobalAction>

        <HeaderGlobalAction
          aria-label={user?.name ? `Logout ${user.name}` : "Logout"}
          onClick={logout}
          tooltipAlignment="end"
          className={styles.userAvatarAction}
        >
          {firstLetter ? (
            <div className={styles.userAvatarLetter}>{firstLetter}</div>
          ) : (
            <span>?</span>
          )}
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};
