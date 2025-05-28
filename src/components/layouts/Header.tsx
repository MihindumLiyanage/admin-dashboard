"use client";

import React from "react";
import {
  Header as CarbonHeader,
  HeaderGlobalBar,
  HeaderGlobalAction,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { Moon, Sun, UserAvatar } from "@carbon/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/layouts/header.module.scss";

export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();

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

        <OverflowMenu
          ariaLabel="User menu"
          flipped
          renderIcon={UserAvatar}
          iconDescription="Open user menu"
        >
          <OverflowMenuItem disabled>
            <span className={styles.username}>{user?.name}</span>
          </OverflowMenuItem>
          <OverflowMenuItem onClick={logout} itemText="Logout" />
        </OverflowMenu>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};
