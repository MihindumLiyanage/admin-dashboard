"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Header as CarbonHeader,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Moon, Sun } from "@carbon/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "@/styles/layouts/header.module.scss";

export const Header = () => {
  const { toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.username?.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const handleSettings = () => {
    router.push("/settings");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <CarbonHeader aria-label="Dashboard Header" className={styles.header}>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Toggle Theme"
          onClick={toggleTheme}
          tooltipAlignment="end"
        >
          {theme === "g100" ? <Sun size={20} /> : <Moon size={20} />}
        </HeaderGlobalAction>

        <div className={styles.userDropdownWrapper} ref={menuRef}>
          <HeaderGlobalAction
            aria-label={`User menu for ${user?.username || "guest"}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            tooltipAlignment="end"
            className={styles.userAvatarAction}
          >
            <div className={styles.userAvatarLetter}>{userInitial}</div>
          </HeaderGlobalAction>

          {menuOpen && (
            <div className={styles.userDropdownMenu}>
              <button
                onClick={handleSettings}
                className={styles.userDropdownItem}
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className={styles.userDropdownItem}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};
