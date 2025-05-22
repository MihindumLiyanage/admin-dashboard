"use client";

import React from "react";
import {
  Header as CarbonHeader,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Moon, Sun, UserAvatar } from "@carbon/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Header.module.scss";

export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuth();

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
        <HeaderGlobalAction aria-label="User Profile" tooltipAlignment="end">
          <UserAvatar size={20} />
          <span className={styles.username}>{user?.name}</span>
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};
